import unittest
from GameEnvironment.gameEngine.gameEnvironment import *


class test_getGameScore(unittest.TestCase):
    def test_getGameScore_should_return_the_same_number_as_input_to_setGameScore(self):
        p1 = player('p1')
        score = 50
        p1.setGameScore(score)
        self.assertIs(p1.getGameScore(),score)

# Run the tests
if __name__ == '__main__':
    unittest.main()