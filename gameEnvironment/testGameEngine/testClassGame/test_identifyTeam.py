import unittest
from GameEnvironment.gameEngine.gameEnvironment import *


class test_identifyTeam(unittest.TestCase):
    def test_identifyTeam_should_get_2_teams_that_has_distinct_player(self):
        friendPosition = None
        playerCard = [None,None,None,None]
        p1 = player("p1")
        p2 = player("p2")
        p3 = player("p3")
        p4 = player("p4")
        game = Game(p1,p2,p3,p4)
        game.setGameScore()
        game.provideCard()
        game.determineBidWinner()
        game.setFriendCard()
        game.identifyTeam()
        self.assertNotEqual(game.getTeam(0),None)
        self.assertNotEqual(game.getTeam(1),None)
        self.assertNotEqual(game.getTeam(0),game.getTeam(1))

        

# Run the tests
if __name__ == '__main__':
    unittest.main()