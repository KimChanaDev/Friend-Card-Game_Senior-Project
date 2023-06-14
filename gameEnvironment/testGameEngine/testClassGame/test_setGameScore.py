import unittest
import sys
sys.path.append('C:\\Users\\User\\Desktop\\gameEnvironment\\gameEnvironment\\gameEngine')

from gameEnvironment import *

# Example function to test


# Test class
class test_setGameScore(unittest.TestCase):
    def test_setGameScore_should_make_all_player_get_0_score(self):
        p1 = player("p1")
        p2 = player("p2")
        p3 = player("p3")
        p4 = player("p4")
        game = Game(p1,p2,p3,p4)
        game.setGameScore()
        self.assertEqual(game.getPlayer(0).getGameScore(),0 )
        self.assertEqual(game.getPlayer(1).getGameScore(),0 )
        self.assertEqual(game.getPlayer(2).getGameScore(),0 )
        self.assertEqual(game.getPlayer(3).getGameScore(),0)

       

# Run the tests
if __name__ == '__main__':
    unittest.main()