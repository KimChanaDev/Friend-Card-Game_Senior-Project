import random
class player:
    def __init__(self, name):
        self.__name = name
        self.__matchScore  = 0
        self.__gameScore = 0
        self.__bidStatus = False
        self.__cards = []
    def dropCard():
        pass
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
        return set(self.__cards)


class card:
    def __init__(self,suite,point):
        self.suite = suite
        self.point = point
    def getPoint(self):
        pass
    def getSuite(self):
        pass
class deck:
    def __init__(self):
        self.__cards = []
        self.initialCard()
    def initialCard(self):
        suites = ['Hearts','Diamonds','Clubs','Spades']
        number = [2,3,4,5,6,7,8,9,10,'J','Q','K','A']
        for i in range(len(suites)):
            for j in range(len(number)):
                Card = card(suites[i],number[j])
                self.__cards.append(Card)
    def shuffle(self):
        for i in range(100):
            random.shuffle(self.__cards)
    def drop(self):
        return self.__cards.pop()
    def getAllcard(self):
        return self.__cards

   
       
        

class team:
    def __init__(self,mate1,mate2,gameScore):
        self.mate1 = mate1
        self.mate2 = mate2
        self.gameScore = gameScore
    def updateScore():
        pass
class Game:
    def __init__(self,p1,p2,p3,p4):
        self.__bidWinner = None
        self.__bidedScore = None
        self.trumpCard = None
        self.frienCard = None
        self.team = None
        self.__players = [None,None,None,None]
        self.__players[0] = p1
        self.__players[1] = p2
        self.__players[2] = p3
        self.__players[3] = p4
        self.__deck = deck()
    
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
        self.__bidWinner = self.__players[winnerIndex]
        self.__bidedScore = BidedPoint[BidedPointIndex]
    def getBidedScore(self):
        return self.__bidedScore
    


def main():
    game = Game()
    game.setGameScore()
    game.provideCard()
    game.determineBidWinner()
    game.setTrumpCard()
    game.setFriendCard()
    game.identifyTeam()

    pass

if __name__ == "__main__":
    main()