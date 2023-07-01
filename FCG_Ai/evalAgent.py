import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
import os
from model import Linear_QNet, QTrainer
from GameEnvironment.gameEngine.gameEnvironment import *
from agent import *
import random

record = {0:0,1:0,2:0,3:0}
def testBot(agent,oldAgent):
    
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
    output =None
    error = False
    count = 0
    while not game.isEndGame():
        if game.getTurnPlayerIndex()==0 :
            state_old,done = agent.get_state(game)
            n_largest = 0
            output = agent.get_best_action(state_old,n_largest)
            while not playCard(game,output):
                n_largest+=1
                output = agent.get_best_action(state_old,n_largest)
                error = True
                
            # if error==True:
            #     count+=1
            #     print(count)
            #     error = False
        else:
            state_old,done = oldAgent.get_state(game)
            n_largest = 0
            output = oldAgent.get_best_action(state_old,n_largest)
            while not playCard(game,output):
                n_largest+=1
                output = oldAgent.get_best_action(state_old,n_largest)
                error = True

    # while not game.isEndGame():
    #     if game.getTurnPlayerIndex()==0:
    #         state_old,done = agent.get_state(game)
    #         n_largest = 0
    #         output = agent.get_action(state_old,n_largest)
    #         while not playCard(game,output):
    #             n_largest+=1
    #             output = agent.get_action(state_old,n_largest)
    #             error = True
    #         # print(n_largest,'n_largest')    
    #         if error==True:
    #             count+=1
    #             # print(count)
    #             error = False
    #     else:
    #         while True:
    #             cardInHand = game.getPlayer(game.getTurnPlayerIndex()).getAllCard()
    #             rand = random.randint(0,len(cardInHand)-1)
    #             randCard = cardInHand[rand]
    #             if game.play_turn(randCard):
    #                 break
    scores = game.summaryScore()
    record[scores.index(max(scores))]+=1
    # scores = game.summaryScore()
    # record[scores.index(max(scores))]+=1

def main():
    oldAgent = Agent()
    oldAgent.loadModel('C:\\Users\\User\\Desktop\\friendCardGame\\model\\ez_first_gen.pth')


    agent = Agent()
    agent.loadModel('C:\\Users\\User\\Desktop\\friendCardGame\\model\\ez_third_gen.pth')
    for i in range(1000):
        # print(i)
        testBot(agent,oldAgent)
    print(record)  
if __name__ == '__main__':
    main()