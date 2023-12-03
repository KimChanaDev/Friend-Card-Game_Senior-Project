import random
import time
import requests

class player:
    def __init__(self, name,index):
        self.__name = name
        self.__matchScore  = 0
        self.__gameScore = 0
        self.__bidStatus = False
        self.__cards = []
        self.__index = index
    def __eq__(self, other):
        if isinstance(other, player):
            return (self.__name == other.__name) and (self.__index == other.__index)
        return False

    def dropCard(self,card):
        self.__cards.remove(card)
    def getIndex(self):
        return self.__index
    def bid(point):
        pass
    def addMatchScore():
        pass
    def getMatchScore():
        pass
    def setGameScore(self,score):
        if score < 0:
            raise ValueError("Negative scores are not allowed.")
        elif score > 100:
            raise ValueError("Scores greater than 100 are not allowed")
        self.__gameScore = score
    def addGameScore(self,score):
        if score < 0:
            raise ValueError("Negative scores are not allowed.")
        elif score > 40:
            raise ValueError("Scores greater than 40 are not allowed")
        self.__gameScore += score
    def getGameScore(self):
        return self.__gameScore
    def addCard(self,card):
        self.__cards.append(card)
    def getAllCard(self):
        return self.__cards
    def canPlayCard(self,card):
        if not card.isValid():
            # print(3)
            return False
        if not self.isCardInhand(card):
           # print(4)
            return False
        CARD_DICT = {0:['Hearts',2],1:['Hearts',3],2:['Hearts',4],3:['Hearts',5],4:['Hearts',6],
                    5:['Hearts',7],6:['Hearts',8],7:['Hearts',9],8:['Hearts',10],9:['Hearts','J'],
                    10:['Hearts','Q'],11:['Hearts','K'],12:['Hearts','A'],

                    13:['Diamonds',2],14:['Diamonds',3],15:['Diamonds',4],16:['Diamonds',5],17:['Diamonds',6],
                    18:['Diamonds',7],19:['Diamonds',8],20:['Diamonds',9],21:['Diamonds',10],22:['Diamonds','J'],
                    23:['Diamonds','Q'],24:['Diamonds','K'],25:['Diamonds','A'],

                    26:['Clubs',2],27:['Clubs',3],28:['Clubs',4],29:['Clubs',5],30:['Clubs',6],
                    31:['Clubs',7],32:['Clubs',8],33:['Clubs',9],34:['Clubs',10],35:['Clubs','J'],
                    36:['Clubs','Q'],37:['Clubs','K'],38:['Clubs','A'],

                    39:['Spades',2],40:['Spades',3],41:['Spades',4],42:['Spades',5],43:['Spades',6],
                    44:['Spades',7],45:['Spades',8],46:['Spades',9],47:['Spades',10],48:['Spades','J'],
                    49:['Spades','Q'],50:['Spades','K'],51:['Spades','A']
            }
        if  CARD_DICT[card.getId()][1]!=card.getActualPoint() or CARD_DICT[card.getId()][0]!=card.getSuite():
            return False
        return True
    def _getRanDomCard(self):
        rand = random.randint(0,len(self.getAllCard())-1)
        return self.getAllCard()[rand]

    def isCardInhand(self,card):
        if card in self.getAllCard():
            return True
        return False
    def getName(self):
        return self.__name
    def getInputPlayedCard(self):
        card = self._getRanDomCard()
        return card

   

class card:
    def __init__(self,suite,point,id):
        logicPointList = [2,3,4,5,6,7,8,9,10,11,12,13,14]
        actualPointList = [2,3,4,5,6,7,8,9,10,'J','Q','K','A']
        scoreList = [0,0,0,5,0,0,0,0,10,0,0,10,0]
        listIndex = actualPointList.index(point)
        self.__suite = suite
        self.__logicPoint = logicPointList[listIndex]
        self.__id = id
        self.__score = scoreList[listIndex]
        self.__actualPoint = point
    def __eq__(self, other):
        if isinstance(other, card):
            return (self.__logicPoint == other.__logicPoint) and (self.__suite == other.__suite)
        return False
    def __hash__(self):
       return self.__id
    def __lt__(self, other):
        return self.__id < other.__id
    def __gt__(self, other):            
        return self.__id > other.__id
    def __str__(self):
        return f"{self.getSuite()} {self.getActualPoint()} "
    def getLogicPoint(self):
        return self.__logicPoint
    def getSuite(self):
        return self.__suite
    def getScore(self):
        return self.__score
    def getActualPoint(self):
        return self.__actualPoint
    def getId(self):
        return self.__id
    
    

    def isValid(self):
        if self.getSuite() not in ['Hearts','Diamonds','Clubs','Spades']:
            return False
        if self.getActualPoint() not in [2,3,4,5,6,7,8,9,10,'J','Q','K','A']:
            return False
        return True
class deck:
    def __init__(self):
        self.__cards = []
        self.initialCard()
    def initialCard(self):
        suites = ['Hearts','Diamonds','Clubs','Spades']
        
        number = [2,3,4,5,6,7,8,9,10,'J','Q','K','A']
        id = 0
        for i in range(len(suites)):
            for j in range(len(number)):
                Card = card(suites[i],number[j],id)
                self.__cards.append(Card)
                id+=1
    def shuffle(self):
        for i in range(100):
            random.shuffle(self.__cards)
    def drop(self):
        return self.__cards.pop()
    def getAllCard(self):
        return self.__cards
    
   
       
        

class team:
    def __init__(self,mate1,mate2,goalScore):
        self.mate1 = mate1
        self.mate2 = mate2
        self.goalScore = goalScore
        self.__win = False
    def getScore(self):
        return self.mate1.getGameScore() + self.mate2.getGameScore()
    def getGoalScore(self):
        return self.__goalScore
    def setWinner(self):
        self.__win = True
    def isWinner(self):
        return self.__win
    def isTeamMember(self,player):
        if player in([self.mate1,self.mate2]):
            return True
        else:
            return False
    def getBuddy(self,player):
        if player not in([self.mate1,self.mate2]):
            return False
        if player ==self.mate1:
            return self.mate2
        if player ==self.mate2:
            return self.mate1
        

class Game:
    def __init__(self,p1,p2,p3,p4):
        self.__bidWinnerPosition = None
        self.__bidedScore = None
        self.__trumpCard = None
        self.__frienCard = None
        self.__players = [None,None,None,None]
        self.__players[0] = p1
        self.__players[1] = p2
        self.__players[2] = p3
        self.__players[3] = p4
        self.__deck = deck()
        self.__team = [None,None]
        self.__firstCardEachRound = None
        self.__playedCardsEachRound = []
        self.__playedCardsEachMatch = []
        self.__heartsVoidCard  = []
        self.__clubsVoidCard  = []
        self.__spadesVoidCard  = []
        self.__diamondsVoidCard  = []
        self.__leadingPlayerIndex = None
        self.__turnPlayerIndex = None
        self.__friendPlayer = None
        self.__trumpPlayedCard = [0 for i in range(13)]
        self.__turn = 1
        self.__round = 1
        self.__isRun = False
        self.__isEndGame = False
        self.__reward = [None,None,None,None]
        self.__playedScoreCard = [0 for i in range(12)]
        self.__isFriendReveal = False
    def getAllPlayerScore(self):
        result = [self.getPlayer(i).getGameScore() for i in range(4)]
        return result
    def getPlayedCardEachRound(self):
        return self.__playedCardsEachRound
    def setGameScore(self):
        self.getPlayer(0).setGameScore(0)
        self.getPlayer(1).setGameScore(0)
        self.getPlayer(2).setGameScore(0)
        self.getPlayer(3).setGameScore(0)
        pass
    def getPlayer(self,index):
        if index < 0:
            raise ValueError("Negative integers are not allowed.")
        elif index > 3:
            raise ValueError("Player indexs greater than 3 are not allowed")
        return self.__players[index]
    def provideCard(self):
        self.__deck.shuffle()
        for i in range(52):
            self.getPlayer(i%4).addCard(self.__deck.drop())
    def determineBidWinner(self):
        BidedPoint = [55,60,65,70,75,80,85,90,95,100]
        winnerIndex = random.randint(0, 3)
        BidedPointIndex = random.randint(0,len(BidedPoint)-1)
        self.__bidWinnerPosition = winnerIndex
        self.__bidedScore = BidedPoint[BidedPointIndex]
        self.setTurnPlayerIndex(winnerIndex)
        self.setLeadingPlayerIndex(winnerIndex)
    def getBidedScore(self):
        return self.__bidedScore
    def randomTrumpCard(self):
         suites = ['Hearts','Diamonds','Clubs','Spades']
         suiteIndex = random.randint(0, 3)
         self.setTrumpCard(suites[suiteIndex])
    def setTrumpCard(self,suite):
        self.__trumpCard = suite
    def getBidWinnerPosition(self):
        return self.__bidWinnerPosition
    def setFriendCard(self):
        Deck = deck()
        allCard = Deck.getAllCard()
        cardInBidWinnerHand = self.getPlayer(self.getBidWinnerPosition()).getAllCard()
        setOfPossibleFriendCard = set(allCard ) - set(cardInBidWinnerHand) 
        rand = random.randint(0,len(setOfPossibleFriendCard)-1)
        self.__frienCard = list(setOfPossibleFriendCard)[rand]
    def getFriendCard(self):
        return self.__frienCard
    def getTeam(self,index):
        return self.__team[index]
    def identifyTeam(self):
        index = [0,1,2,3]
        index.remove(self.getBidWinnerPosition())
        for i in range(4):
            if self.__frienCard in set(self.getPlayer(i).getAllCard()):
                friendPlayer = self.getPlayer(i)
                self.setFriendPlayer(friendPlayer)
                BidWinnerPlayer = self.getPlayer(self.getBidWinnerPosition())
                self.__team[0] = team(friendPlayer,BidWinnerPlayer,self.getBidedScore())
                index.remove(i)
                player3 = self.getPlayer(index[0])
                player4 = self.getPlayer(index[1])
                team2_scoreToWin = 100-self.getBidedScore()+5
                self.__team[1] = team(player3,player4,team2_scoreToWin)
    def setFriendPlayer(self,player):
        self.__friendPlayer = player
    def getFriendPlayer(self):
        return self.__friendPlayer
 
    def setTrumpPlayedCard(self,value):
        logicPoint = [2,3,4,5,6,7,8,9,10,11,12,13,14]
        self.__trumpPlayedCard[logicPoint.index(value)] = 1
    def getTrumpPlayedCard(self):
        return self.__trumpPlayedCard

    def processPlayerAction(self,playerIndex,action):
        player = self.getPlayer(playerIndex)
        
        # [print(i,end='') for i in player.getAllCard()]
        # print()
        if not player.canPlayCard(action):
           
            # print( ', '.join(map(str, player.getAllCard())))
            # print(action)
            # print()
            #print(len(player.getAllCard()))
            
            # print('false',action)
            return False
        if player.canPlayCard(action) and self.isNotViolateGameLaw(action):
            # print('not void')
            return action
        if self.isVoidCard(player.getAllCard(),self.__playedCardsEachRound[0],playerIndex):
            # print('void')
            return action
        return False
    
   
    def updatePlayedCardEachRound(self,card): 
        self.__playedCardsEachRound.append(card)
    def updateCardInPlayerHand(self,playerIndex,card):
        self.getPlayer(playerIndex).dropCard(card)
    def isNotViolateGameLaw(self,card):
        if len(self.__playedCardsEachRound)==0:
            return True
        # if card.getSuite() == self.getTrumpCard():
        #     return True
        if card.getSuite() == self.__playedCardsEachRound[0].getSuite():
            return True
        return False
        
    def getTrumpCard(self):
        return self.__trumpCard
    def isVoidCard(self,cards,card,playerIndex):
        for i in range (len(cards)):
            if cards[i].getSuite() == card.getSuite():
                return False
        self.setGeneralVoidCard(playerIndex,card.getSuite())
        return True
    def setGeneralVoidCard(self,playerIndex,suite):
        suites = ['Hearts','Diamonds','Clubs','Spades']
        if suites.index(suite) ==0:
            self.setHeartsVoidCard(playerIndex,suite)
        elif suites.index(suite) ==1:
            self.setDiamondsVoidCard(playerIndex,suite)
        elif suites.index(suite) ==2:
            self.setClubsVoidCard(playerIndex,suite)
        else:
            self.setSpadesVoidCard(playerIndex,suite)
        
    def setHeartsVoidCard(self,playerIndex,suite):
        self.__heartsVoidCard.append(playerIndex)
    def setDiamondsVoidCard(self,playerIndex,suite):
        self.__diamondsVoidCard.append(playerIndex)
    def setClubsVoidCard(self,playerIndex,suite):
        self.__clubsVoidCard.append(playerIndex)
    def setSpadesVoidCard(self,playerIndex,suite):
        self.__spadesVoidCard.append(playerIndex)

    def getHeartsVoidCard(self):
        result = sorted(self.__heartsVoidCard)
        while len(result)<4:
            result.append(-1)
        return result
    def getDiamondsVoidCard(self):
        result = sorted(self.__diamondsVoidCard)
        while len(result)<4:
            result.append(-1)
        return result
    def getClubsVoidCard(self):
        result = sorted(self.__clubsVoidCard)
        while len(result)<4:
            result.append(-1)
        return result
    def getSpadesVoidCard(self):
        result = sorted(self.__spadesVoidCard)
        while len(result)<4:
            result.append(-1)
        return result
    
    def cleanUpGame(self):
        self.__clubsVoidCard = []
        self.__diamondsVoidCard = []
        self.__spadesVoidCard = []
        self.__heartsVoidCard = []
        self.__playedCardsEachRound = []
       
        self.sendToApi()

   
    def determineHighestCard(self,cards):
        returnCardIndex = None
        leadSuiteCard = cards[0].getSuite()
        indices_trump_cards = [i for i, card in enumerate(cards) if card.getSuite() ==self.getTrumpCard() ]
        if len(indices_trump_cards)==0:
            returnCardIndex = self.processHighestCard(cards,leadSuiteCard)
        else:
            returnCardIndex = self.processHighestCard(cards,self.getTrumpCard())
        return returnCardIndex
        
    def processHighestCard(self,cards,suite):
        indices_candidate_cards = [i for i, card in enumerate(cards) if card.getSuite() ==suite ]
        returnCardIndex = indices_candidate_cards[0]
        for i in range (1,len(indices_candidate_cards)):
            if cards[indices_candidate_cards[i]] > cards[returnCardIndex]:
                returnCardIndex = indices_candidate_cards[i]
        return returnCardIndex
    def setTurnPlayerIndex(self,index):
        self.__turnPlayerIndex = index
    def getTurnPlayerIndex(self):
        return self.__turnPlayerIndex
    def incTurnPlayerIndex(self):
        self.__turnPlayerIndex = (self.__turnPlayerIndex+1)%4
        self.sendToApi()
    def calculateGameScore(self,cards):
        score = sum( card.getScore() for card in cards)
        return score
    def setPlayedScoreCard(self,cards):
        suites = ['Hearts','Diamonds','Clubs','Spades']
        scores  = [5,10,'K']
        for card in cards:
            if card.getActualPoint() in scores:
                suiteIndex = suites.index(card.getSuite())
                scoreIndex = scores.index(card.getActualPoint())
                self.__playedScoreCard[suiteIndex * 3 + scoreIndex] = 1
    def getPlayedScoreCard(self):
        return self.__playedScoreCard
    def play_turn(self,action):
        if self.isFirstTurnEver():
            self.showDataWhenRoundGetStart()
        playerIndex = self.getTurnPlayerIndex()
        card = self.processPlayerAction(playerIndex,action)
        if not card:
           # print('player',playerIndex+1,'plays invalid card',action)
            return False
        # print('player',playerIndex+1,'plays',card.getActualPoint(),card.getSuite())
        if card.getSuite() == self.getTrumpCard():
            self.setTrumpPlayedCard(card.getLogicPoint())
        if card == self.getFriendCard():
            self.setFriendRevealFlag()
        self.updatePlayedCardEachRound(card)
        self.updateCardInPlayerHand(playerIndex,card)
        # self.sendToApi()
        self.incTurn()
        return True
    def setFriendRevealFlag(self):
        self.__isFriendReveal = True
    def isFriendReveal(self):
        return self.__isFriendReveal
    def incTurn(self):
        if self.__turn+1 > 4:
            self.__turn = 1
            self.incRound()
        else:
            self.__turn+=1
            self.incTurnPlayerIndex()
    def getTurn(self):
        return self.__turn
    
    def getRound(self):
        return self.__round
    def incRound(self):
        self.processAfterRoundEnd()
        self.cleanUpGame()
        if self.__round + 1 > 13:
            self.sendToApi()
            self.setEndGameStatus(True)
        else:
            self.__round+=1
            self.showDataWhenRoundGetStart()
    def sendToApi(self):
        turn = self.getTurnPlayerIndex()
        turnArr = [False if turn!=i else True for i in range(4)]
        trumpCard = self.getTrumpCard()
        friendCard = self.getFriendCard().getId()
        cardInhand = [card.getId() for card in sorted(self.getPlayer(turn).getAllCard())]
        cardPlayedEachRound = self.getPlayedCardEachRound()
        IDcardPlayedEachRound  = [ card.getId() for card in cardPlayedEachRound]
        Allscore = [ self.getPlayer(i).getGameScore() for i in range(4)]
        output = {'cardInhand':cardInhand,'cardInfield':IDcardPlayedEachRound,'matchScore':Allscore,
                  'turn':turnArr,'trumpCard':trumpCard,'friendCard':friendCard
        }
        # print('yo') 
        # requests.post('http://127.0.0.1:3000/game', json=output)
        # time.sleep(3)
        
        
    def setEndGameStatus(self,endGameStatus):
        self.__isEndGame = endGameStatus
    def isFirstTurnEver(self):
        if (self.__isRun):
            return False
        self.__isRun = True
        return True
    def reset(self):
        self.__isRun = False
        self.setEndGameStatus(False)
        self.__round = 1
        self.sendToApi()
       
    def isEndGame(self):
        return self.__isEndGame
    def showDataWhenGameStart(self):
        # print("bid winner is player",self.getBidWinnerPosition()+1)
        # print("trump card is",self.getTrumpCard())
        # print("friend card is",self.getFriendCard().getActualPoint(),self.getFriendCard().getSuite())
        # print ("friend is ",self.getFriendPlayer().getName())
        pass
    def setRewardEachRound(self,highestCardIndex,score):
        for i in range(4):
            if(highestCardIndex==i):
                self.__reward[i] = score * 6
            else:
                self.__reward[i] = 0
 
    def processAfterRoundEnd(self):
        highestCardIndex = self.determineHighestCard(self.__playedCardsEachRound)
        self.setPlayedScoreCard(self.__playedCardsEachRound)
        playerIndex = (highestCardIndex + self.getTurnPlayerIndex()+1)%4
        score = self.calculateGameScore(self.__playedCardsEachRound)
        self.setRewardEachRound(highestCardIndex,score)
        player = self.getPlayer(playerIndex)
        oldScore = player.getGameScore()
        player.addGameScore(score)
        # print("Player ",playerIndex+1,"accumulate score",oldScore,'+',score,'=',player.getGameScore())
        self.setTurnPlayerIndex(playerIndex)
        self.setLeadingPlayerIndex(playerIndex)
        self.sendToApi()
        
        # print('-----------------------------------------------')
    def getLeadingPlayerIndex(self):
        return self.__leadingPlayerIndex
    def setLeadingPlayerIndex(self,index):
        self.__leadingPlayerIndex = index
    def showDataWhenRoundGetStart(self):
        # print('round',self.getRound())
        # print('Player',self.getTurnPlayerIndex()+1,'is leading player')
        pass
    
    def summaryScore(self):
        scores = []
        # print('summary score')
        for i in range (4):
            # print('player',i+1,'get',self.getPlayer(i).getGameScore(),'scores')
            scores.append(self.getPlayer(i).getGameScore())
        # print("team bid winner & friend get ",self.getTeam(0).getScore())
        # print("other team get ",self.getTeam(1).getScore())
        return scores

    def summaryTeamScore(self):
        scores = []
        # print('summary score')
        bidwinnerTeam = self.getBidWinnerTeam()
        otherTeam = self.getOtherTeam()
        for i in range (4):
            player = self.getPlayer(i)
            if (bidwinnerTeam.isTeamMember(player)):    
                scores.append(bidwinnerTeam.getScore())
            else:
                scores.append(otherTeam.getScore())
        # print("team bid winner & friend get ",self.getTeam(0).getScore())
        # print("other team get ",self.getTeam(1).getScore())
        # print(scores)
        return scores
        
    def getReward(self):
        return self.__reward
    def getBidWinnerTeam(self):
        return self.getTeam(0)
    def getOtherTeam(self):
        return self.getTeam(1)
    def determineMatchWinner(self):
        bidwinnerTeam = self.getBidWinnerTeam()
        otherTeam = self.getOtherTeam()
        if bidwinnerTeam.getGoalScore() < bidwinnerTeam.getScore():
            otherTeam.setWinner()
            # print('------------------------------------')
            # print('the winner is bidWinner team')
            # print('------------------------------------')
        else:
            bidwinnerTeam.setWinner()
            # print('------------------------------------')
            # print('the winner is bidLoser team')
            # print('------------------------------------')

  
        
def main():
    # bidding phase
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
    game.showDataWhenGameStart()
    while not game.isEndGame():
        current_player = game.getPlayer(game.getTurnPlayerIndex())
        action = current_player.getInputPlayedCard()
        game.play_turn(action)
        print('i')
    game.summaryScore()
if __name__ == "__main__":
    main()