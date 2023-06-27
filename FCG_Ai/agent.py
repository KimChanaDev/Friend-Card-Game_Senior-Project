import torch
import random
import numpy as np
from collections import deque
from GameEnvironment.gameEngine.gameEnvironment import *
from model import Linear_QNet, QTrainer
from helper import plot

MAX_MEMORY = 100_000
BATCH_SIZE = 1000
LR = 0.00001
CARD_DICT = {'Hearts':{2:0,3:1,4:2,5:3,6:4,7:5,8:6,9:7,10:8,'J':9,'Q':10,'K':11,'A':12},
            'Diamonds':{2:13,3:14,4:15,5:16,6:17,7:18,8:19,9:20,10:21,'J':22,'Q':23,'K':24,'A':25},
            'Clubs':{2:26,3:27,4:28,5:29,6:30,7:31,8:32,9:33,10:34,'J':35,'Q':36,'K':37,'A':38},
            'Spades':{2:39,3:40,4:41,5:42,6:43,7:44,8:45,9:46,10:47,'J':48,'Q':49,'K':50,'A':51},

    }

class Agent:

    def __init__(self):
        self.n_games = 0
        self.epsilon = 0 # randomness
        self.gamma = 0.618 # discount rate
        self.memory = deque(maxlen=MAX_MEMORY) # popleft()
        self.model = Linear_QNet(125, 256, 28)
        self.model.load_state_dict(torch.load('C:\\Users\\User\\Desktop\\friendCardGame\\model\\model.pth'))
        self.model.eval()
        self.trainer = QTrainer(self.model, lr=LR, gamma=self.gamma)


    def get_state(self, game):
        playerIndex = game.getTurnPlayerIndex()
        leadingIndex = game.getLeadingPlayerIndex()
        suites = ['Hearts','Diamonds','Clubs','Spades']
        cardInhand = [card.getId() for card in sorted(game.getPlayer(playerIndex).getAllCard())]
        cardInhand = [1 if i in cardInhand else 0 for i in range(52)]
        cardPlayedEachRound = game.getPlayedCardEachRound()
        IDcardPlayedEachRound  = [ card.getId() for card in cardPlayedEachRound]
        leadingSuite = None
        if len(cardPlayedEachRound)==0:
            leadingSuite = [0,0,0,0]
        else:
            leadingSuite = [1 if cardPlayedEachRound[0].getSuite()==suites[i] else 0 for i in range(4)]
        trumpSuite= [0,0,0,0]
        trumpSuite[suites.index(game.getTrumpCard()) ]  =  1
        trumpPlayedCard = game.getTrumpPlayedCard()
        cardInField = [1 if i in IDcardPlayedEachRound else 0 for i in range(52)]
        state = cardInhand+leadingSuite+trumpSuite+cardInField+trumpPlayedCard
     #   print(state)
        # card in hand , leading suite, trump suite,card in field,trump card
        # 52,4,4,52,13
        done = game.isEndGame()
        return np.array(state, dtype=int),done

    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done)) # popleft if MAX_MEMORY is reached

    def train_long_memory(self):
        if len(self.memory) > BATCH_SIZE:
            mini_sample = random.sample(self.memory, BATCH_SIZE) # list of tuples
        else:
            mini_sample = self.memory

        states, actions, rewards, next_states, dones = zip(*mini_sample)
        self.trainer.train_step(states, actions, rewards, next_states, dones)
        #for state, action, reward, nexrt_state, done in mini_sample:
        #    self.trainer.train_step(state, action, reward, next_state, done)

    def train_short_memory(self, state, action, reward, next_state, done):
        self.trainer.train_step(state, action, reward, next_state, done)

    def get_action(self, state,n_largest):
        # random moves: tradeoff exploration / exploitation
        # 'Hearts','Diamonds','Clubs','Spades'
        club_to_play = [0,0,0,0,0,0,0]
        spade_to_play = [0,0,0,0,0,0,0] 
        diamon_to_play = [0,0,0,0,0,0,0] 
        heart_to_play = [0,0,0,0,0,0,0]
        card_to_play = heart_to_play+diamon_to_play+club_to_play+spade_to_play 
        self.epsilon = 8000-self.n_games
        rand = random.randint(0, 200)
        # print(rand)
        # if  rand< self.epsilon:
        #     action = random.randint(0, 27)
        #     #print(action)
        #     card_to_play[action] = 1
        # else:
        state0 = torch.tensor(state, dtype=torch.float)
        prediction = self.model(state0)
        values, indices = torch.topk(prediction, k=28)
        # print(prediction)
        # print(prediction,"(predict)")
        # action = (torch.argmax(prediction).item() + offset) % 28
        action = indices[n_largest].item()
        # print(action,'action')
        card_to_play[action] = 1
            

        return card_to_play
    def get_reward(self,game):
        return game.getReward()

def train(agent):
    plot_scores = []
    plot_mean_scores = []
    total_score = 0
    record = 0
    p1 = player("p1",0)
    p2 = player("p2",1)
    p3 = player("p3",2)
    p4 = player("p4",3)
    game = Game(p1,p2,p3,p4)
    game.setGameScore()
    game.provideCard()
    game.determineBidWinner()
    game.randomTrumpCard()
    game.setFriendCard()
    game.identifyTeam()
    game.reset()
    state_old = [None,None,None,None]
    output = [None,None,None,None]
    
    while not game.isEndGame():
        print(game.getRound())
        for i in range(4):
            state_old[i],done = agent.get_state(game)
            output[i] = agent.get_action(state_old[i],0)
            outputDict = {}
            offset = 1
            while not playCard(game,output[i]):
                
                reward = -1000
                state_new,done = agent.get_state(game)
                
                agent.train_short_memory(state_old[i],output[i], reward, state_new, done)
                agent.remember(state_old[i],output[i], reward, state_new, done)
                output[i] = agent.get_action(state_old[i],offset)
                offset+=1
                # print(output[i])
                if output[i].index(max(output[i])) not in outputDict:
                    outputDict[output[i].index(max(output[i]))] = 1
                # print(len(outputDict))
        state_new,done =  agent.get_state(game)
        reward = agent.get_reward(game)
        for i in range(4):
            agent.train_short_memory(state_old[i],output[i], reward[i], state_new, done)
            agent.remember(state_old[i],output[i], reward[i], state_new, done)
    
        if done:
            # train long memory, plot result
            # game.reset()
            agent.n_games += 1
            agent.train_long_memory()

    game.summaryScore()
    # winnerTeam = None
    # if game.getBidWinnerTeam().isWinner():
    #     winnerTeam = game.getBidWinnerTeam
    # else:
    #     winnerTeam = game.getOtherTeam()
    # indexWinner1 = winnerTeam.mate1.getIndex()
    # indexWinner2 = winnerTeam.mate1.getIndex()


def mapOutPutToCard(output):
    arr = np.array(output)
    arr = arr.reshape(4,7)
    indices = np.where(arr == 1)
    suites = ['Hearts','Diamonds','Clubs','Spades']
    suiteIndex = indices[0][0]
    pointIndex = indices[1][0]
    points = [0,5,10,'J','Q','K','A']
    smallPoints = [2,3,4,6,7,8,9]
    suiteOutput = suites[suiteIndex]
    pointOutput = points[pointIndex]
    
    if(pointOutput ==0):
        cardOutput = [card(suiteOutput,point,CARD_DICT[suiteOutput][point]) for point in smallPoints]
    else:
        cardOutput = [card(suiteOutput,pointOutput,CARD_DICT[suiteOutput][pointOutput])]
    return cardOutput
def playCard(game,output):
    card_to_play = mapOutPutToCard(output)
    for i in range(len(card_to_play)) :
        if game.play_turn(card_to_play[i]):
            return True
    return False

def main():
    agent = Agent()
    epochs = 10
    batchs = 1000
    for epoch in range(epochs):
        for batch in range(batchs):
            print('epoch',epoch,'batch',batch)
            train(agent)
        agent.model.save()

if __name__ == '__main__':
    main()


# to do 

# implement determine score 