import torch
import random
import numpy as np
from collections import deque
from GameEnvironment.gameEngine.gameEnvironment import *
from model import Linear_QNet, QTrainer
from helper import plot

MAX_MEMORY = 100_000
BATCH_SIZE = 1000
LR = 0.001

class Agent:

    def __init__(self):
        self.n_games = 0
        self.epsilon = 0 # randomness
        self.gamma = 0.9 # discount rate
        self.memory = deque(maxlen=MAX_MEMORY) # popleft()
        self.model = Linear_QNet(55, 256, 28)
        self.trainer = QTrainer(self.model, lr=LR, gamma=self.gamma)


    def get_state(self, game):
        playerIndex = game.getTurnPlayerIndex()
        leadingIndex = game.getLeadingPlayerIndex()
        suites = ['Hearts','Diamonds','Clubs','Spades']
        cardInhand = [card.getId() for card in sorted(game.getPlayer(playerIndex).getAllCard())]
        while len(cardInhand) < 13:
            cardInhand.append(-1)
        cardPlayedEachRound = game.getPlayedCardEachRound()
        playersGameScore = game.getAllPlayerScore()
        trumpCard =  suites.index(game.getTrumpCard())  
        clubsVoid = game.getClubsVoidCard()
        heartsVoid  = game.getHeartsVoidCard()
        diamondsVoid = game.getDiamondsVoidCard()
        spadesVoid = game.getSpadesVoidCard()
        trumpPlayedCard = game.getTrumpPlayedCard()
        # print('all trump',trumpPlayedCard)
        friendTeam = [game.getTeam(0).mate1.getIndex(),game.getTeam(0).mate2.getIndex()]
        state = [playerIndex,leadingIndex,trumpCard]+cardInhand+cardPlayedEachRound\
                +playersGameScore\
                +clubsVoid+heartsVoid+diamondsVoid+spadesVoid\
                +trumpPlayedCard+friendTeam
        # print(len(state))
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

    def get_action(self, state):
        # random moves: tradeoff exploration / exploitation
        # 'Hearts','Diamonds','Clubs','Spades'
        club_to_play = [0,0,0,0,0,0,0]
        spade_to_play = [0,0,0,0,0,0,0] 
        diamon_to_play = [0,0,0,0,0,0,0] 
        heart_to_play = [0,0,0,0,0,0,0]
        card_to_play = heart_to_play+diamon_to_play+club_to_play+spade_to_play 
        self.epsilon = 300 - self.n_games
        if random.randint(0, 200) < self.epsilon:
            action = random.randint(0, 27)
            #print(action)
            card_to_play[action] = 1
        else:
            state0 = torch.tensor(state, dtype=torch.float)
            prediction = self.model(state0)
            action = torch.argmax(prediction).item()
            card_to_play[action] = 1

        return card_to_play
    def get_reward(self,game):
        return game.getReward()

def train():
    plot_scores = []
    plot_mean_scores = []
    total_score = 0
    record = 0
    agent = Agent()
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
        for i in range(4):
            state_old[i],done = agent.get_state(game)
            output[i] = agent.get_action(state_old)
            while not playCard(game,output[i]):
                reward = -1000
                state_new,done = agent.get_state(game)
                
                agent.train_short_memory(state_old[i],output[i], reward, state_new, done)
                agent.remember(state_old[i],output[i], reward, state_new, done)
                output[i] = agent.get_action(state_old)
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
    fakeID = 0
    if(pointOutput ==0):
        cardOutput = [card(suiteOutput,point,fakeID) for point in smallPoints]
    else:
        cardOutput = [card(suiteOutput,pointOutput,fakeID)]
    return cardOutput
def playCard(game,output):
    card_to_play = mapOutPutToCard(output)
    for i in range(len(card_to_play)) :
        if game.play_turn(card_to_play[i]):
            return True
    return False
if __name__ == '__main__':
    train()


# to do 

# implement determine score 