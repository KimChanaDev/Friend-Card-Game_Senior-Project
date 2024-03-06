import torch
import random
import numpy as np
from collections import deque
from GameEnvironment.gameEngine.gameEnvironment import *
from model import Linear_QNet, QTrainer
from FCG_Ai.noob_model.agent import Agent
# from helper import plot
import requests
import time
from utils import *
MAX_MEMORY = 2000000
BATCH_SIZE = 100000
LR = 0.01
CARD_DICT = {'Hearts':{2:0,3:1,4:2,5:3,6:4,7:5,8:6,9:7,10:8,'J':9,'Q':10,'K':11,'A':12},
            'Diamonds':{2:13,3:14,4:15,5:16,6:17,7:18,8:19,9:20,10:21,'J':22,'Q':23,'K':24,'A':25},
            'Clubs':{2:26,3:27,4:28,5:29,6:30,7:31,8:32,9:33,10:34,'J':35,'Q':36,'K':37,'A':38},
            'Spades':{2:39,3:40,4:41,5:42,6:43,7:44,8:45,9:46,10:47,'J':48,'Q':49,'K':50,'A':51},

    }


class teamAgent:

    def __init__(self):
        self.n_games = 0
        self.epsilon = 0 # randomness
        self.gamma = 0.9 # discount rate
        self.memory = deque() # popleft()
        self.model = Linear_QNet(125, 256, 28)
        self.trainer = QTrainer(self.model, lr=LR, gamma=self.gamma)
        self.buddyCard = None
        self.buddyIndex = None
        
    def loadModel(self,path):
        self.model.load_state_dict(torch.load(path))
        self.model.eval()
        self.trainer = QTrainer(self.model, lr=LR, gamma=self.gamma)

    def convert_card_array_size_from_52_to_28(self,card):
        
        card = np.array(card).reshape(4,13)
        newCard = np.zeros([4,7])
        # print(card,'card')
        for i in range(4):
            for j in range(13):
                if ((j in [0,1,2,4,5,6,7] ) and (card[i,j]==1)):
                    card[i,0] = 1      
                    break
            newCard[i] = np.concatenate((np.array([card[i,0]]),np.array([card[i,3]]),card[i,8:] ))
        newCard = newCard.reshape(-1)
        newCard = list(newCard)
       
        return newCard
        
    
    def get_state(self, game):
        playerIndex = game.getTurnPlayerIndex()
        turn = [1 if i==game.getTurn()-1 else 0 for i in range(4)]
        suites = ['Hearts','Diamonds','Clubs','Spades']
        cardInhand = [card.getId() for card in sorted(game.getPlayer(playerIndex).getAllCard())]
        cardInhand = [1 if i in cardInhand else 0 for i in range(52)]
        cardInhand = self.convert_card_array_size_from_52_to_28(cardInhand)
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
        cardInField = self.convert_card_array_size_from_52_to_28(cardInField)
        playedScoreCard = game.getPlayedScoreCard()
       
        bidwinnerTeam = game.getBidWinnerTeam()
        otherTeam = game.getOtherTeam()

     

        buddyCard = [0 for i in range(28)]
        buddyIndex  = [0 for i in range(4)]

        AgentPlayer = game.getPlayer(playerIndex)
        if (game.getBidWinnerPosition()!=playerIndex and bidwinnerTeam.isTeamMember(AgentPlayer)) or  game.isFriendReveal():
            buddyCard = self.buddyCard
            buddyIndex = [1 if i==self.buddyIndex else 0   for i in range(4)]
            # print('bid team')
        
        state = cardInhand+leadingSuite+trumpSuite+cardInField+trumpPlayedCard+playedScoreCard+turn+buddyCard+buddyIndex
     #   print(state)
        # card in hand , leading suite, trump suite,card in field,trump card,playedScorecard,turn
        # 52,4,4,52,13,12,4
        # lack order of player 5 10 k that was play each round
        done = game.isEndGame()
        return np.array(state, dtype=int),done

    def rememberFriendCard(card):
        self.friendCard = card
         


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

    def initOutput(self):
        club_to_play = [0,0,0,0,0,0,0]
        spade_to_play = [0,0,0,0,0,0,0] 
        diamon_to_play = [0,0,0,0,0,0,0] 
        heart_to_play = [0,0,0,0,0,0,0]
        output = heart_to_play+diamon_to_play+club_to_play+spade_to_play
        return output  
    
    def get_action(self, state,n_largest):
        self.epsilon = 80000-self.n_games
        rand = random.randint(0,200)
        card_to_play = self.initOutput()
        # print(rand)
        if  rand< self.epsilon:
            action = random.randint(0, 27)
            #print(action)
            card_to_play[action] = 1
        else:
            card_to_play = self.get_best_action(state)
            
        return card_to_play
    def get_best_action(self, state):
        state0 = torch.tensor(state, dtype=torch.float)
        prediction = self.model(state0)
        card_to_play = self.initOutput()
        validAction = [prediction[i] if notViolateRule(state0,i) else -100000 for i in range(28)]
        validAction = torch.tensor(validAction, dtype=torch.float)
        values, indices = torch.topk(validAction, k=28)
        action = indices[0].item()
        card_to_play[action] = 1
        # print(card_to_play)
        return card_to_play


    def get_reward(self,game):
        return game.getReward()
        

def train(newAgent,oldAgent):
    plot_scores = []
    plot_mean_scores = []
    total_score = 0
    record = 0
    p1 = player("p1",0)
    p2 = player("p2",1)
    p3 = player("p3",2)
    p4 = player("p4",3)
    game = Game(p1,p2,p3,p4)
    playerList = [p1,p2,p3,p4]

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
    

    bidwinnerTeam = game.getBidWinnerTeam()
    otherTeam = game.getOtherTeam()
    for i in range(4):
        if bidwinnerTeam.isTeamMember(playerList[i]):
            buddy = bidwinnerTeam.getBuddy(playerList[i])
        else:
            buddy = otherTeam.getBuddy(playerList[i])
        if i==0:
            newAgent.buddyIndex = buddy.getIndex()  
        else:
            oldAgent[i-1].buddyIndex =  buddy.getIndex()   
  

    while not game.isEndGame():
        newAgent.buddyCard  = [0 for i in range(28)]
        oldAgent[0].buddyCard  = [0 for i in range(28)]
        oldAgent[1].buddyCard  = [0 for i in range(28)]
        oldAgent[2].buddyCard  = [0 for i in range(28)]
        output_as_state = [o for i in range(28)]
        for i in range(4):
           
            if game.getTurnPlayerIndex() ==0:
                state_old,done = newAgent.get_state(game)
                n_largest = 0
                output = newAgent.get_action(state_old,n_largest)
                order = i
                while not playCard(game,output):
                    output = newAgent.get_action(state_old,n_largest)
                    n_largest = (n_largest + 1) % 28
                output_as_state = output
            else:
                old_state_old,old_done = oldAgent.get_state(game)
                best_act = oldAgent.get_best_action(old_state_old)
                output_as_state = best_act
                playCard(game,best_act)
                if game.getTurnPlayerIndex() == buddy.getIndex():
                    newAgent.buddyCard = best_act

            for j in range(3):
                if oldAgent[j].buddyIndex == game.getTurnPlayerIndex():
                    oldAgent[j].buddyCard = output_as_state

        reward = newAgent.get_reward(game)[order]
        
        if (game.getBidWinnerPosition()!=0 and bidwinnerTeam.isTeamMember(p1)) or  game.isFriendReveal():
            reward = reward * 2
        
        if  game.isEndGame():
            train_state_new = state_old
            newAgent.remember(train_state_old,train_output, train_reward, train_state_new, train_done)
            newAgent.train_short_memory(train_state_old,train_output, train_reward, train_state_new, train_done)

            train_output = output
            train_state_old = state_old
            # print('endc')
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
        
def play(newAgent):
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
    oldAgent = Agent()
    oldAgent.loadModel('C:\\Users\\User\\Desktop\\friendCardGame\\teamwork_model\\ez_seventh_gen.pth')
    round = 1
    while not game.isEndGame():
       
        print(round)
        for i in range(4):
            # output = getOutput()
            # while not playCard(game,output):
            #     output = getOutput()
            
            
            if game.getTurnPlayerIndex() ==0:
                state_old,done = newAgent.get_state(game)
                
                output = newAgent.get_best_action(state_old)
                playCard(game,output)
                 
            
                # newAgent.sendToApi(game)
                # playCard(game,output)
            else:
                old_state_old,old_done = oldAgent.get_state(game)
                # oldAgent.sendToApi(game)
                old_output = oldAgent.get_best_action(old_state_old)
                # playCard(game,old_output)
                playCard(game,old_output)
                    
        round+=1
   

def getOutput():
    num = int(input('give me output number'))
    output = [ 1 if i==num else 0 for i in range(28)]
    return output
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
            # print(card_to_play[i])
            # print(card_to_play[i].getSuite()=='Diamonds')
            return True
    return False

def testTeamworkBot(newAgent,oldAgent):
    
    plot_scores = []
    plot_mean_scores = []
    total_score = 0
    record = 0
    p1 = player("p1",0)
    p2 = player("p2",1)
    p3 = player("p3",2)
    p4 = player("p4",3)
    game = Game(p1,p2,p3,p4)
    playerList = [p1,p2,p3,p4]

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
    

    bidwinnerTeam = game.getBidWinnerTeam()
    otherTeam = game.getOtherTeam()
    for i in range(4):
        if bidwinnerTeam.isTeamMember(playerList[i]):
            buddy = bidwinnerTeam.getBuddy(playerList[i])
        else:
            buddy = otherTeam.getBuddy(playerList[i])
        if i==0:
            newAgent.buddyIndex = buddy.getIndex()  
        else:
            oldAgent[i-1].buddyIndex =  buddy.getIndex()   
  

    while not game.isEndGame():
        newAgent.buddyCard  = [0 for i in range(28)]
        oldAgent[0].buddyCard  = [0 for i in range(28)]
        oldAgent[1].buddyCard  = [0 for i in range(28)]
        oldAgent[2].buddyCard  = [0 for i in range(28)]
        output_as_state = [0 for i in range(28)]
        for i in range(4):
            turnPlayerIndex = game.getTurnPlayerIndex()
            if turnPlayerIndex ==0:
                state_old,done = newAgent.get_state(game)
                n_largest = 0
                output = newAgent.get_best_action(state_old)
                playCard(game,output)
                output_as_state = output
            else:
                old_state_old,old_done = oldAgent[turnPlayerIndex-1].get_state(game)
                best_act = oldAgent[turnPlayerIndex-1].get_best_action(old_state_old)
                output_as_state = best_act
                playCard(game,best_act)
                if turnPlayerIndex == buddy.getIndex():
                    newAgent.buddyCard = best_act

            for j in range(3):
                if oldAgent[j].buddyIndex == turnPlayerIndex:
                    oldAgent[j].buddyCard = output_as_state
    scores = game.summaryScore()
    return scores
def main():
    oldAgent = []
    for i in range(3):
        agent = Agent()
        agent.loadModel('C:\\Users\\User\\Desktop\\friendCardGame\\teamwork_model\\ez_0_gen.pth')
        oldAgent.append(agent)
    newAgent = teamAgent()
    record = {0:0,1:0,2:0,3:0}
    newAgent.loadModel('C:\\Users\\User\\Desktop\\friendCardGame\\teamwork_model\\ez_1_gen.pth')
    for i in range(1000):
        print('round',i)
        scores = testTeamworkBot(newAgent,oldAgent)
        record[scores.index(max(scores))]+=1
    print(record)
        # print(scores)  
        # train(newAgent,oldAgent)
        # if (i+1) % 1000 ==0:
        #     newAgent.train_long_memory() 
    # newAgent.model.save('ez_1_gen.pth')
    
    # play(newAgent)
if __name__ == '__main__':
    main()


# to do 

# implement determine score 