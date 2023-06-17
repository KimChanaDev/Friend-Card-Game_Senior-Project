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

    def isCardInhand(self,card):
        if card in self.getAllCard():
            return True
        return False

   

class card:
    def __init__(self,suite,point,id):
        self.__suite = suite
        self.__point = point
        self.__id = id
    def getPoint(self):
        return self.__point
    def getSuite(self):
        return self.__suite
    def __eq__(self, other):
        if isinstance(other, card):
            return (self.__point == other.__point) and (self.__suite == other.__suite)
        return False
    def __hash__(self):
        return self.__id
    def isValid(self):
        if self.getSuite() not in ['Hearts','Diamonds','Clubs','Spades']:
            return False
        if self.getPoint() not in [2,3,4,5,6,7,8,9,10,'J','Q','K','A']:
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
    def updateScore():
        pass
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
    def getBidedScore(self):
        return self.__bidedScore
    def setTrumpCard(self):
         suites = ['Hearts','Diamonds','Clubs','Spades']
         suiteIndex = random.randint(0, 3)
         self.__trumpCard = suites[suiteIndex]
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
                BidWinnerPlayer = self.getPlayer(self.getBidWinnerPosition())
                self.__team[0] = team(friendPlayer,BidWinnerPlayer,self.getBidedScore())
                index.remove(i)
                player3 = self.getPlayer(index[0])
                player4 = self.getPlayer(index[1])
                team2_scoreToWin = 100-self.getBidedScore()+5
                self.__team[1] = team(player3,player4,team2_scoreToWin)
    def playRound(self):
        for i in range (4):
            playerIndex = (self.getBidWinnerPosition()+i ) %4
            card = self.getPlayedCard(playerIndex)
            self.updatePlayedCardEachRound(card)
            self.updateCardInPlayerHand(playerIndex,card)
  
    def getPlayedCard(self,playerIndex):
        while True:
                if processPlayerAction(playerIndex):
                    break
    def processPlayerAction(self,playerIndex):
        player = self.getPlayer(playerIndex)
        playedCard = self.getPlayedCard()
        if player.canPlayCard(playedCard) and self.isViolateGameLaw(playedCard):
            return playedCard
        if self.isVoidCard(player.getAllCard(),self.__playedCardsEachRound[0]):
            return playedCard
        return False
    def setPlayedCard(self,card):
        self.__playedCard = card
    def getPlayedCard(self):
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
            if not cards[i].getSuite() == card.getSuite():
                return True
        return False
        

                        
 
def main():
    # bidding phase
    game = Game()
    game.setGameScore()
    game.provideCard()
    game.determineBidWinner()
    game.setTrumpCard()
    game.setFriendCard()
    game.identifyTeam()
    # gameplay phase

    game.playRound()  # dont for get to invoke getPlayed Card method in this function
    # determine what card is the highest tier
    #calculate point go to the right person
    #determine who is the first to play next round

if __name__ == "__main__":
    main()