import random
import time

class player:
    def __init__(self, name,index):
        self.__name = name
        self.__matchScore  = 0
        self.__gameScore = 0
        self.__bidStatus = False
        self.__cards = []
        self.__bidScore = None
        self.__index = index
    def getIndex(self):
        return self.__index
    def dropCard(self,card):
        self.__cards.remove(card)
   
    def addMatchScore(self,score):
        self.__matchScore+=score
    def subMatchScore(self,score):
        if score < 0:
            score = 0
        self.__matchScore-=score
    def getMatchScore(self):
        return self.__matchScore
    def setBidScore(self,score):
        self.__bidScore = score
    def getBidScore(self):
        return getBidScore
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
        print('----------------------------------------')
        print('player',self.getIndex()+1,'card now')
        cardInHand = sorted(self.getAllCard())
        for i,card in enumerate(cardInHand):
            print(i+1,card)
        print("player",self.getIndex()+1,"type card number to play 1-",len(cardInHand))
        index = int(input("select your card: "))-1
        print('---------------------------------------------')
        print()
        card = cardInHand[index]
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
        self.__mate1 = mate1
        self.__mate2 = mate2
        self.__goalScore = goalScore
        self.__win = False
    def getScore(self):
        return self.__mate1.getGameScore() + self.__mate2.getGameScore()
    def setWinner(self):
        self.__win = True
    def isWinner(self):
        return self.__win
    def getPlayer(self,index):
        if index == 0:
            return self.__mate1
        return self.__mate2
    def getGoalScore(self):
        return self.__goalScore
class Game:
    def __init__(self,p1,p2,p3,p4):
        self.__bidWinnerIndex = None
        self.__bidScore = None
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
    def BiddingPhase(self):
        self.setBidScore(50)
        player1 = self.getPlayer(0)
        player2 = self.getPlayer(1)
        player3 = self.getPlayer(2)
        player4 = self.getPlayer(3)
        playerList = [player1,player2,player3,player4]
        while len(playerList) > 1:
            BiddingPlayer = playerList.pop(0)
            currentBidScore = self.takeBidFromPlayer(BiddingPlayer)
            if currentBidScore != 0:
                self.setBidScore(currentBidScore)
                playerList.append(BiddingPlayer)
        biddingWinner = playerList.pop()
        
        if currentBidScore==0:
            currentBidScore = 55
        self.setBidScore(currentBidScore)
        self.setBidWinnerIndex(biddingWinner.getIndex())
        self.setLeadingPlayerIndex(biddingWinner.getIndex())
        print('Player',biddingWinner.getIndex()+1,'is bid winner')
        print('bid score is',self.getBidScore())
        print('-------------------------------------------')
    def takeBidFromPlayer(self,player):
        while True:
            previousBid = self.getBidScore()
            print(player.getName(),"should bid more than ",previousBid,"type 0 for pass")
            bidScore = int(input("bid : "))
            if self.isValidBid(previousBid,bidScore):
                return bidScore
    def isValidBid(self,previousBid,currentBid):
        if((currentBid > previousBid )and (currentBid % 5==0)):
            return True
        if currentBid == 0:
            return True
        return False
    def setBidWinnerIndex(self,index):
        self.__bidWinnerIndex = index    
            
    def setBidScore(self,score):
        self.__bidScore = score
    def getBidScore(self):
        return self.__bidScore
    def selectTrumpCard(self):
        bidWinnerCards =  sorted(self.getBidWinnerPlayer().getAllCard())
        print('card in player',self.getBidWinnerIndex()+1,'hand')
        for card in bidWinnerCards:
            print(card) 
        print('-------------------------------------------------')
        print("select your trump card")
        print(" 1. Hearts, 2. Diamonds,3. Clubs,4.Spades")
        suiteIndex = int(input("enter number (1-4): ")) - 1
        suites = ['Hearts','Diamonds','Clubs','Spades']
        self.setTrumpCard(suites[suiteIndex])
        print("trump card is",self.getTrumpCard())
        print('-----------------------------------------------')
    def setTrumpCard(self,suite):
        self.__trumpCard = suite
    def getBidWinnerIndex(self):
        return self.__bidWinnerIndex
    def selectFriendCard(self):
        Deck = deck()
        allCard = Deck.getAllCard()
        print("---------------------------------------------------------------------")
        print("your card now")
        cardInPlayerHand  = sorted(self.getPlayer(self.getBidWinnerIndex()).getAllCard())
        for card in cardInPlayerHand:
            print(card)
        print("---------------------------------------------------------------------")
        cardInBidWinnerHand = self.getPlayer(self.getBidWinnerIndex()).getAllCard()
        setOfPossibleFriendCards = set(allCard ) - set(cardInBidWinnerHand)
        sortedPossibleFriendCards =  sorted(list(setOfPossibleFriendCards))
    
        print("all cards that can choose as friend card")
        for i,card in enumerate(sortedPossibleFriendCards) :
            print(i+1,card)
            # print(i+1)
            time.sleep(0.5)
        print('---------------------------------------------------')    
        indexFriend =  int(input("select number (1-39) : ")) -1
        print("friend card is",sortedPossibleFriendCards[indexFriend])
        self.setFriendCard(sortedPossibleFriendCards[indexFriend])
        print('---------------------------------------------------')  
    def setWinnerTeam(self,index):
        self.getTeam(index).setWinner()
     
    def setFriendCard(self,card):
        self.__frienCard = card
    def getFriendCard(self):
        return self.__frienCard
    def getTeam(self,index):
        return self.__team[index]
    def identifyTeam(self):
        index = [0,1,2,3]
        index.remove(self.getBidWinnerIndex())
        BidWinnerPlayer = self.getPlayer(self.getBidWinnerIndex())
        self._findFriendPlayer()
        friendPlayer = self.getFriendPlayer()
        self.__team[0] = team(BidWinnerPlayer,friendPlayer,self.getBidScore())
        index.remove(self.getFriendPlayer().getIndex())
        player3 = self.getPlayer(index[0])
        player4 = self.getPlayer(index[1])
        team2_scoreToWin = 100-self.getBidScore()+5
        self.__team[1] = team(player3,player4,team2_scoreToWin)
    def _findFriendPlayer(self):
        friendCard = self.getFriendCard()
        for i in range(4):
            if friendCard  in set(self.getPlayer(i).getAllCard()):
                friendPlayer = self.getPlayer(i)
                self.setFriendPlayer(friendPlayer)
    
    def setFriendPlayer(self,player):
        self.__friendPlayer = player
    def getFriendPlayer(self):
        return self.__friendPlayer
    def playRound(self):
        for i in range (4):
            playerIndex = (self.getLeadingPlayerIndex()+i ) %4
            card = self.getPlayedCard(playerIndex)
            self.updatePlayedCardEachRound(card)
            self.updateCardInPlayerHand(playerIndex,card)
  
    def getPlayedCard(self,playerIndex):
        while True:
                card = self.processPlayerAction(playerIndex)
                if card:
                    print('player',playerIndex+1,'plays',card.getActualPoint(),card.getSuite())
                    return card
                print("invalid card")
    def processPlayerAction(self,playerIndex):
        player = self.getPlayer(playerIndex)
        playedCard = player.getInputPlayedCard()
        if player.canPlayCard(playedCard) and self.isNotViolateGameLaw(playedCard):
            return playedCard
        if self.isVoidCard(player.getAllCard(),self.__playedCardsEachRound[0]):
            return playedCard
        return False
    
   
    def updatePlayedCardEachRound(self,card): 
        self.__playedCardsEachRound.append(card)
    def updateCardInPlayerHand(self,playerIndex,card):
        self.getPlayer(playerIndex).dropCard(card)
    def isNotViolateGameLaw(self,card):
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
        print('---------------------------------------------------')
        print("bid winner is player",self.getBidWinnerIndex()+1)
        print("trump card is",self.getTrumpCard())
        print("friend card is",self.getFriendCard().getActualPoint(),self.getFriendCard().getSuite())
        print ("friend is ",self.getFriendPlayer().getName())
        print('---------------------------------------------------')
        for i in range(13):
            print('round',i+1)
            self.__playedCardsEachRound = []
            print('player',self.getLeadingPlayerIndex()+1,"is leading player")
            self.playRound()
            playerIndex = (self.determineHighestCard(self.__playedCardsEachRound) + self.getLeadingPlayerIndex())%4
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
            if cards[indices_candidate_cards[i]].getLogicPoint() > cards[returnCardIndex].getLogicPoint():
                returnCardIndex = indices_candidate_cards[i]
        return returnCardIndex
    def setLeadingPlayerIndex(self,index):
        self.__leadingPlayerIndex = index
    def getLeadingPlayerIndex(self):
        return self.__leadingPlayerIndex
    def calculateGameScore(self,cards):
        score = sum( card.getScore() for card in cards)
        return score
    def getBidWinnerTeam(self):
        return self.getTeam(0)
    def calculateMatchScore(self):
        bidWinner = self.getBidWinnerPlayer()
        friendPlayer = self.getFriendPlayer()
        bidScore = self.getBidScore()
        otherTeam = self.getTeam(1)
        otherPlayer1 = otherTeam.getPlayer(0)
        otherPlayer2 = otherTeam.getPlayer(1)
        if self.getBidWinnerTeam().isWinner():
            bidWinner.addMatchScore(bidScore+bidWinner.getGameScore())
            friendPlayer.addMatchScore((bidScore/2)+friendPlayer.getGameScore())
            otherPlayer1.subMatchScore(100-bidScore)
            otherPlayer2.subMatchScore(100-bidScore)
            return
        otherPlayerMatchScore  = (otherPlayer1.getGameScore()+otherPlayer2.getGameScore())/2
        otherPlayer1.addMatchScore(otherPlayerMatchScore)
        otherPlayer2.addMatchScore(otherPlayerMatchScore)
        bidWinner.subMatchScore(bidScore)
        friendPlayer.subMatchScore((bidScore/2)-friendPlayer.getGameScore())
    def getBidWinnerPlayer(self):
        return self.getPlayer(self.getBidWinnerIndex())
    def getOtherTeam(self):
        return self.getTeam(1)
    def determineMatchWinner(self):
        bidwinnerTeam = self.getBidWinnerTeam()
        otherTeam = self.getOtherTeam()
        if bidwinnerTeam.getGoalScore() < bidwinnerTeam.getScore():
            otherTeam.setWinner()
        else:
            bidwinnerTeam.setWinner()
        
def main():
    # bidding phase
    p1 = player("p1",0)
    p2 = player("p2",1)
    p3 = player("p3",2)
    p4 = player("p4",3)
    game = Game(p1,p2,p3,p4)
    game.setGameScore()
    game.provideCard()
    game.BiddingPhase()
    game.selectTrumpCard()
    game.selectFriendCard()
    game.identifyTeam()
    # gameplay phase
    game.playMatch()  # dont forget to invoke getPlayedCard method in playRound
    game.determineMatchWinner()
    game.calculateMatchScore()


if __name__ == "__main__":
    main()