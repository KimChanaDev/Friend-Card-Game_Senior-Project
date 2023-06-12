import unittest
import sys
sys.path.append('C:\\Users\\User\\Desktop\\gameEnvironment\\gameEnvironment\\gameEngine')

from gameEnvironment import *


class testPlayer(unittest.TestCase):
    def test_setGameScore(self):
        p1 = player('p1')
        p1.setGameScore(50)
        self.assertIs(p1.getGameScore(),50)
        self.assertRaises(ValueError,p1.setGameScore,-42)
        self.assertRaises(ValueError,p1.setGameScore,101)
    def test_getGameScore(self):
        p1 = player('p1')
        score = 50
        p1.setGameScore(score)
        self.assertIs(p1.getGameScore(),score)

# Run the tests
if __name__ == '__main__':
    unittest.main()