import unittest
import sys
sys.path.append('C:\\Users\\User\\Desktop\\gameEnvironment\\gameEnvironment\\gameEngine')

from gameEnvironment import *

class test_SetGameScore(unittest.TestCase):
    def test_setGameScore_should_make_player_get_same_score_if_score_is_in_0_and_100(self):
        p1 = player('p1')
        p1.setGameScore(50)
        self.assertIs(p1.getGameScore(),50)
        
    def test_setGameScore_should_raises_valueError_if_get_negative_input(self):
        p1 = player('p1')
        self.assertRaises(ValueError,p1.setGameScore,-42)
    def test_setGameScore_should_raises_valueError_if_get_input_greater_than_100(self):
        p1 = player('p1')
        self.assertRaises(ValueError,p1.setGameScore,101)

# Run the tests
if __name__ == '__main__':
    unittest.main()