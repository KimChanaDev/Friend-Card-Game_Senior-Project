class player:
    def __init__(self, name):
        self.name = name
        self.matchScore  = 0
        self.gameScore   = 0
        self.bidStatus = False
        self.card = []
    def dropCard():
        pass
    def bid(point):
        pass
    def setMatchScore():
        pass
    def getMatchScore():
        pass
    def setGameScore():
        pass
    def getGameScore():
        pass
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
    def __init__(self):
        self.trumpCard
        self.frienCard
        self.team
    
    def setGameScore():
        pass


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