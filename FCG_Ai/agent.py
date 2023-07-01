import torch
import random
import numpy as np
from collections import deque
from GameEnvironment.gameEngine.gameEnvironment import *
from model import Linear_QNet, QTrainer
from helper import plot

MAX_MEMORY = 2000000
BATCH_SIZE = 10000
LR = 0.01
CARD_DICT = {'Hearts':{2:0,3:1,4:2,5:3,6:4,7:5,8:6,9:7,10:8,'J':9,'Q':10,'K':11,'A':12},
            'Diamonds':{2:13,3:14,4:15,5:16,6:17,7:18,8:19,9:20,10:21,'J':22,'Q':23,'K':24,'A':25},
            'Clubs':{2:26,3:27,4:28,5:29,6:30,7:31,8:32,9:33,10:34,'J':35,'Q':36,'K':37,'A':38},
            'Spades':{2:39,3:40,4:41,5:42,6:43,7:44,8:45,9:46,10:47,'J':48,'Q':49,'K':50,'A':51},

    }


class Agent:

    def __init__(self):
        self.n_games = 0
        self.epsilon = 0 # randomness
        self.gamma = 0.9 # discount rate
        self.memory = deque() # popleft()
        self.model = Linear_QNet(125, 256, 28)
        self.trainer = QTrainer(self.model, lr=LR, gamma=self.gamma)
        self.n_largest = 0
    def loadModel(self,path):
        self.model.load_state_dict(torch.load(path))
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
        rand = random.randint(0,200)
        # print(rand)
        if  rand< self.epsilon:
            action = random.randint(0, 27)
            #print(action)
            card_to_play[action] = 1
        else:
            state0 = torch.tensor(state, dtype=torch.float)
            prediction = self.model(state0)
            # print(prediction)
            validAction = [prediction[i] if self.notViolateRule(state0,i) else -100000 for i in range(28)]
            validAction = torch.tensor(validAction, dtype=torch.float)
            values, indices = torch.topk(validAction, k=28)
            action = indices[self.n_largest].item()
            
            card_to_play[action] = 1
            # print('state',state0)
            # print('valid',validAction)
            # print(prediction)
            # print(prediction,"(predict)")
            # action = (torch.argmax(prediction).item() + n_largest) % 28
            # print(action,'action')
            
        return card_to_play
    def get_best_action(self, state,n_largest):
        # random moves: tradeoff exploration / exploitation
        # 'Hearts','Diamonds','Clubs','Spades'
        club_to_play = [0,0,0,0,0,0,0]
        spade_to_play = [0,0,0,0,0,0,0] 
        diamon_to_play = [0,0,0,0,0,0,0] 
        heart_to_play = [0,0,0,0,0,0,0]
        card_to_play = heart_to_play+diamon_to_play+club_to_play+spade_to_play 
        
        state0 = torch.tensor(state, dtype=torch.float)
        prediction = self.model(state0)
        values, indices = torch.topk(prediction, k=28)
        # print(prediction)
        # print(prediction,"(predict)")
        # action = (torch.argmax(prediction).item() + n_largest) % 28
        action = indices[n_largest].item()
        # print(action,'action')
        card_to_play[action] = 1
        return card_to_play


    def get_reward(self,game):
        return game.getReward()
        
    def notViolateRule(self,state_tensor,action):
        state_array = state_tensor.numpy()
        cardInhand = state_array[0:52]
        leadingSuite = state_array[52:56]
        trumpSuite = state_array[56:60]
      
        if not self.isCardInhand(cardInhand,action):
            return False
        if self.isLeadingAction(leadingSuite):
            return True
        if self.isFollowLeading(leadingSuite,action):
            return True
        if self.isVoidCard(cardInhand,leadingSuite):
            return True
        return False
    def isCardInhand(self,cards,action):
        # print(action)
        row_index = int(action / 7)
        #  print(row_index)

        col_index = int(action%7)
        # points = [0,5,10,'J','Q','K','A']
        # smallPoints = [2,3,4,5,6,7,8,9,10,'J','Q','K','A']
        mapActToOut = {0:[0,1,2,4,5,6,7],1:[3],2:[8],3:[9],4:[10],5:[11],6:[12]}
        # print(mapActToOut[col_index])
        for i in range(len(mapActToOut[col_index])):
            if (cards[(row_index*13)+mapActToOut[col_index][i]]==1):
                return True
        return False
    
    def isVoidCard(self,cards,leadingSuite):

        leadingSuiteIndex = np.where(leadingSuite == 1)
        leadingSuiteIndex = leadingSuiteIndex[0][0]
        # print(leadingSuiteIndex)
        for i in range(13):
            if cards[leadingSuiteIndex*13+i]==1:
                return False
        return True

    def isFollowLeading(self,leadingSuite,action):
        row_index = int(action / 7)
        if leadingSuite[row_index]==1:
            return True
        return False
    def isLeadingAction(self,leadingSuite):
        if all(suite == 0 for suite in leadingSuite):
            return True
        return False

def play(newAgent):
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
    state_old = None
    state_new = None
    output = None
    reward =  None
    done = None
    order = None

    train_state_old = None
    train_state_new = None
    train_output = None
    train_reward = None
    train_done = None
   

    oldAgent = Agent()
    oldAgent.loadModel('C:\\Users\\User\\Desktop\\friendCardGame\\model\\ez_second_gen.pth')
    
    while not game.isEndGame():

        for i in range(4):
            if game.getTurnPlayerIndex() ==0:
                state_old,done = newAgent.get_state(game)
                n_largest = 0
                output = newAgent.get_action(state_old,n_largest)
                order = i
                while not playCard(game,output):
                    output = newAgent.get_action(state_old,n_largest)
                    n_largest = (n_largest + 1) % 28
            else:
                old_state_old,old_done = oldAgent.get_state(game)
                n_largest = 0
                old_output = oldAgent.get_best_action(old_state_old,n_largest)
                while not playCard(game,old_output):
                    old_output = oldAgent.get_best_action(old_state_old,n_largest)
                    n_largest+=1
        reward = newAgent.get_reward(game)[order]
        if  game.isEndGame():
            train_state_new = state_old
            newAgent.remember(train_state_old,train_output, train_reward, train_state_new, train_done)
            newAgent.train_short_memory(train_state_old,train_output, train_reward, train_state_new, train_done)

            train_output = output
            train_state_old = state_old
            train_state_new,train_done =  newAgent.get_state(game)
            train_reward = reward
            newAgent.remember(train_state_old,train_output, train_reward, train_state_new, train_done)
            newAgent.train_short_memory(train_state_old,train_output, train_reward, train_state_new, train_done)
            newAgent.n_games += 1
            return
        
        if game.getRound()!=2:
            train_state_new = state_old
            newAgent.remember(train_state_old,train_output, train_reward, train_state_new, train_done)
            newAgent.train_short_memory(train_state_old,train_output, train_reward, train_state_new, train_done)
        
        train_state_old = state_old
        train_output = output
        train_reward = reward
        train_done  = done
        
        
    
          
    # game.summaryScore()
def mapCardToOutPut(card):
    suites = ['Hearts','Diamonds','Clubs','Spades']
    points = [0,5,10,'J','Q','K','A']
    smallPoints = [2,3,4,6,7,8,9]
    rowAction = suites.index(card.getSuite())
    colAction = None
    if card.getActualPoint() in smallPoints:
        colAction = 0
    else:
        colAction = points.index(card.getActualPoint())
    output = [0 for i in range(28)]
    output[rowAction* 7 + colAction] = 1
    return output
    

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
    newAgent = Agent()
    newAgent.loadModel('C:\\Users\\User\\Desktop\\friendCardGame\\model\\ez_second_gen.pth')
    for i in range(10000):
        play(newAgent)
        if i % 1000 ==0:
            newAgent.train_long_memory()
        print('round',i)  
    newAgent.model.save('ez_third_gen.pth')
if __name__ == '__main__':
    main()


# to do 

# implement determine score 