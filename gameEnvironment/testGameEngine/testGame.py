import unittest
import sys
sys.path.append('C:\\Users\\User\\Desktop\\gameEnvironment\\gameEnvironment\\gameEngine')

from gameEnvironment import *

# Example function to test


# Test class
class testCard(unittest.TestCase):
    # def test_provideCard(self):
    #     p1 = player()
    #     p2 = player()
    #     p3 = player()
    #     p4 = player()
    #     game = Game(p1,p2,p3,p4)
    #     pass
    def test_setGameScore(self):
        p1 = player("p1")
        p2 = player("p2")
        p3 = player("p3")
        p4 = player("p4")
        game = Game(p1,p2,p3,p4)
        game.setGameScore()
        self.assertEqual(game.getPlayer1().getGameScore(),0 )
        self.assertEqual(game.getPlayer2().getGameScore(),0 )
        self.assertEqual(game.getPlayer3().getGameScore(),0 )
        self.assertEqual(game.getPlayer4().getGameScore(),0)
    def test_getPlayer(self,index):
        p1 = player("p1")
        p2 = player("p2")
        p3 = player("p3")
        p4 = player("p4")
        game = Game(p1,p2,p3,p4)
        self.assertIs(game.getPlayer(0),p1)
        self.assertIs(game.getPlayer(3),p4)
        self.assertRaises(NegativeIntegerError, game.getPlayer, -42)
        self.assertRaises(ValueError, game.getPlayer, 4)
        

       

# Run the tests
if __name__ == '__main__':
    unittest.main()