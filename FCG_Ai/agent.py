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
        self.model = Linear_QNet(11, 256, 3)
        self.trainer = QTrainer(self.model, lr=LR, gamma=self.gamma)


    def get_state(self, game,playerIndex):
        leadingIndex = game.getLeadingPlaeyrIndex()
        suites = ['Hearts','Diamonds','Clubs','Spades']
        cardInhand = [card.getId() for card in sorted(game.getPlayer(playerIndex).getAllcard())]
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
        friendTeam = [game.getTeam(0).mate1.getIndex(),game.getTeam(0).mate2.getIndex()]
        state = [playerIndex,leadingIndex,trumpCard]+cardInhand+cardPlayedEachRound+playersGameScore\
                +clubsVoid+heartsVoid+diamondsVoid+spadesVoid\
                +trumpPlayedCard+friendTeam
        return np.array(state, dtype=int)

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
        club_to_play = [0,0,0,0,0,0,0]
        spade_to_play = [0,0,0,0,0,0,0] 
        diamon_to_play = [0,0,0,0,0,0,0] 
        heart_to_play = [0,0,0,0,0,0,0]
        card_to_play = club_to_play+spade_to_play+diamon_to_play+heart_to_play  
        self.epsilon = 300 - self.n_games
        if random.randint(0, 200) < self.epsilon:
            action = random.randint(0, 27)
            card_to_play[action] = 1
        else:
            state0 = torch.tensor(state, dtype=torch.float)
            prediction = self.model(state0)
            action = torch.argmax(prediction).item()
            card_to_play[action] = 1

        return card_to_play


def train():
    plot_scores = []
    plot_mean_scores = []
    total_score = 0
    record = 0
    agent = Agent()
    game = SnakeGameAI()
    while True:
        # get old state
        state_old = agent.get_state(game)

        # get move
        final_move = agent.get_action(state_old)

        # perform move and get new state
        reward, done, score = game.play_step(final_move)
        state_new = agent.get_state(game)

        # train short memory
        agent.train_short_memory(state_old, final_move, reward, state_new, done)

        # remember
        agent.remember(state_old, final_move, reward, state_new, done)

        if done:
            # train long memory, plot result
            game.reset()
            agent.n_games += 1
            agent.train_long_memory()

            if score > record:
                record = score
                agent.model.save()

            print('Game', agent.n_games, 'Score', score, 'Record:', record)

            plot_scores.append(score)
            total_score += score
            mean_score = total_score / agent.n_games
            plot_mean_scores.append(mean_score)
            plot(plot_scores, plot_mean_scores)

def playMatch(game):
    print("bid winner is player",game.getBidWinnerPosition()+1)
    print("trump card is",game.getTrumpCard())
    print("friend card is",game.getFriendCard().getActualPoint(),game.getFriendCard().getSuite())
    print ("friend is ",game.getFriendPlayer().getName())
    
    for i in range(13):
        print('round',i+1)
        game.cleanUpGame()
        print('Player',game.getLeadingPlaeyrIndex()+1,'is leading player')
        playRound(game)
        playerIndex = (game.determineHighestCard(game.__playedCardsEachRound) + game.getLeadingPlaeyrIndex())%4
        score = game.calculateGameScore(game.__playedCardsEachRound)
        player = game.getPlayer(playerIndex)
        oldScore = player.getGameScore()
        player.addGameScore(score)
        print("Player ",playerIndex+1,"accumulate score",oldScore,'+',score,'=',player.getGameScore())
        game.setLeadingPlayerIndex(playerIndex)
        print('-----------------------------------------------')
    print('summary score')
    for i in range (4):
        print('player',i+1,'get',game.getPlayer(i).getGameScore(),'scores')
    print("team bid winner & friend get ",game.getTeam(0).getScore())
    print("other team get get ",game.getTeam(1).getScore())

def playRound(game):
    for i in range (4):
        # print("cardPlayed",game.getPlayedCardEachRound())
        print("all score",game.getAllPlayerScore())
        playerIndex = (game.getLeadingPlaeyrIndex()+i ) %4
        card = getPlayedCard(game,playerIndex)
        if card.getSuite() == game.getTrumpCard():
            game.setTrumpPlayedCard(card.getLogicPoint())
        game.updatePlayedCardEachRound(card)
        game.updateCardInPlayerHand(playerIndex,card)

def getPlayedCard(game,playerIndex):
    while True:
            card = game.processPlayerAction(playerIndex)
            if card:
                print('player',playerIndex+1,'plays',card.getActualPoint(),card.getSuite())
                return card

def processPlayerAction(game,playerIndex):
    player = game.getPlayer(playerIndex)
    playedCard = player.getInputPlayedCard()
    if player.canPlayCard(playedCard) and game.isNotViolateGameLaw(playedCard):
        return playedCard
    if game.isVoidCard(player.getAllCard(),game.__playedCardsEachRound[0],playerIndex):
        return playedCard
    return False
if __name__ == '__main__':
    train()