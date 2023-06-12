class player:
    def __init__(self, name):
        self.__name = name
        self.__matchScore  = 0
        self.__gameScore = 0
        self.__bidStatus = False
        self.__card = []
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
    def addCard():
        pass
    def getCard():
        pass


class card:
    def __init__(self,suite,point):
        self.suite = suite
        self.point = point
    def getPoint():
        pass
    def getSuite():
        pass
class deck:
    def __init__(self):
        self.card = []
    def initialCard():
        pass
    def shuffle():
        pass
    def drop():
        pass
    def add():
        pass

class team:
    def __init__(self,mate1,mate2,gameScore):
        self.mate1 = mate1
        self.mate2 = mate2
        self.gameScore = gameScore
    def updateScore():
        pass
class Game:
    def __init__(self,p1,p2,p3,p4):
        self.trumpCard = None
        self.frienCard = None
        self.team = None
        self.__players = [None,None,None,None]
        self.__players[0] = p1
        self.__players[1] = p2
        self.__players[2] = p3
        self.__players[3] = p4
    
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
   
    


def main():
    game = Game()
    game.setGameScore()
    game.provideCard()
    game.setTrumpCard()
    game.setFriendCard()
    game.identifyTeam()

    pass

if __name__ == "__main__":
    main()