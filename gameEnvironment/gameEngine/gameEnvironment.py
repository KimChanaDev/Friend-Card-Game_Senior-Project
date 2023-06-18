import random


class player:
    def __init__(self, name):
        self.__name = name
        self.__matchScore  = 0
        self.__gameScore = 0
        self.__bidStatus = False
        self.__cards = []
    def dropCard(self,card):
        self.__cards.remove(card)
    def bid(point):
        pass
    def setMatchScore():
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
            return False
        if not self.isCardInhand(card):
            return False
        return True
    def getRanDomCard(self):
        rand = random.randint(0,len(self.getAllCard())-1)
        return self.getAllCard()[rand]

    def isCardInhand(self,card):
        if card in self.getAllCard():
            return True
        return False
    def getName(self):
        return self.__name

   

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
        return self.__logicPoint < other.__logicPoint
    
    def __gt__(self, other):
        return self.__logicPoint > other.__logicPoint
    def getLogicPoint(self):
        return self.__logicPoint
    def getSuite(self):
        return self.__suite
    def getScore(self):
        return self.__score
    def getActualPoint(self):
        return self.__actualPoint
    
    
    

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
    def getScore(self):
        return self.mate1.getGameScore() + self.mate2.getGameScore()
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
        self.__playedCard = None
        self.__leadingPlayerIndex = None
        self.__friendPlayer = None
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
    def playRound(self):
        for i in range (4):
            playerIndex = (self.getLeadingPlaeyrIndex()+i ) %4
            card = self.getPlayedCard(playerIndex)
            self.updatePlayedCardEachRound(card)
            self.updateCardInPlayerHand(playerIndex,card)
  
    def getPlayedCard(self,playerIndex):
        while True:
                card = self.processPlayerAction(playerIndex)
                if card:
                    print('player',playerIndex+1,'plays',card.getActualPoint(),card.getSuite())
                    return card
    def processPlayerAction(self,playerIndex):
        player = self.getPlayer(playerIndex)
        playedCard = player.getRanDomCard()
        if player.canPlayCard(playedCard) and self.isViolateGameLaw(playedCard):
            return playedCard
        if self.isVoidCard(player.getAllCard(),self.__playedCardsEachRound[0]):
            return playedCard
        return False
    def setPlayedCard(self,card):
        self.__playedCard = card
    def getInputPlayedCard(self):
        return self.__playedCard
    def updatePlayedCardEachRound(self,card): 
        self.__playedCardsEachRound.append(card)
    def updateCardInPlayerHand(self,playerIndex,card):
        self.getPlayer(playerIndex).dropCard(card)
    def isViolateGameLaw(self,card):
        if len(self.__playedCardsEachRound)==0:
            return True
        if card.getSuite() == self.getTrumpCard():
            return True
        if card.getSuite() == self.__playedCardsEachRound[0].getSuite():
            return True
        return False
        
    def getTrumpCard(self):
        return self.__trumpCard
    def isVoidCard(self,cards,card):
        for i in range (len(cards)):
            if cards[i].getSuite() == card.getSuite():
                return False
        return True
    def playMatch(self):
        print("bid winner is player",self.getBidWinnerPosition()+1)
        print("trump card is",self.getTrumpCard())
        print("friend card is",self.getFriendCard().getActualPoint(),self.getFriendCard().getSuite())
        print ("friend is ",self.getFriendPlayer().getName())
       
        for i in range(13):
            print('round',i+1)
            self.__playedCardsEachRound = []
            print('Player',self.getLeadingPlaeyrIndex()+1,'is leading player')
            self.playRound()
            playerIndex = (self.determineHighestCard(self.__playedCardsEachRound) + self.getLeadingPlaeyrIndex())%4
            score = self.calculateGameScore(self.__playedCardsEachRound)
            player = self.getPlayer(playerIndex)
            oldScore = player.getGameScore()
            player.addGameScore(score)
            print("Player ",playerIndex+1,"accumulate score",oldScore,'+',score,'=',player.getGameScore())
            self.setLeadingPlayerIndex(playerIndex)
            print('-----------------------------------------------')
        print('summary score')
        for i in range (4):
            print('player',i+1,'get',self.getPlayer(i).getGameScore(),'scores')
        print("team bid winner & friend get ",self.getTeam(0).getScore())
        print("other team get get ",self.getTeam(1).getScore())
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
    def setLeadingPlayerIndex(self,index):
        self.__leadingPlayerIndex = index
    def getLeadingPlaeyrIndex(self):
        return self.__leadingPlayerIndex
    def calculateGameScore(self,cards):
        score = sum( card.getScore() for card in cards)
        return score
 
def main():
    # bidding phase
    p1 = player("p1")
    p2 = player("p2")
    p3 = player("p3")
    p4 = player("p4")
    game = Game(p1,p2,p3,p4)
    game.setGameScore()
    game.provideCard()
    game.determineBidWinner()
    game.randomTrumpCard()
    game.setFriendCard()
    game.identifyTeam()
    # gameplay phase
    game.playMatch()  # dont forget to invoke getPlayedCard method in playRound

if __name__ == "__main__":
    main()