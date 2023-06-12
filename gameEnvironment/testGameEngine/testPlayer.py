import unittest
import sys
sys.path.append('C:\\Users\\User\\Desktop\\gameEnvironment\\gameEnvironment\\gameEngine')

from gameEnvironment import *


class testPlayer(unittest.TestCase):
    def test_setGameScore(self):
        player = player('p1')
        player.setGameScore(50)
        self.assertIs(player.getGameScore(),50)
        self.assertRaises(NegativeIntegerError,player.setGameScore,-42)
        self.assertRaises(ValueError,player.setGameScore,100)
    def test_getGameScore(self):
        player = player('p1')
        score = 50
        player.setGameScore(score)
        self.assertIs(player.getGameScore(),score)

# Run the tests
if __name__ == '__main__':
    unittest.main()