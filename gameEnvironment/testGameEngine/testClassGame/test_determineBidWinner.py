import unittest
from GameEnvironment.gameEngine.gameEnvironment import *


class test_determineBidWinner(unittest.TestCase):
    def test_determineBidWinner_should_get_the_most_valid__bid_score(self):
        p1 = player("p1")
        p2 = player("p2")
        p3 = player("p3")
        p4 = player("p4")
        game = Game(p1,p2,p3,p4)
        game.determineBidWinner()
        mostScore = game.getBidedScore()
        self.assertGreater(mostScore,50)
        self.assertLessEqual(mostScore,100)
        self.assertEqual(mostScore%5,0)
        self.assertIn(game.getBidWinnerPosition(),[0,1,2,3])

# Run the tests
if __name__ == '__main__':
    unittest.main()