import unittest
import sys
sys.path.append('C:\\Users\\User\\Desktop\\gameEnvironment\\gameEnvironment\\gameEngine')

from gameEnvironment import *

# Example function to test


# Test class
class testCard(unittest.TestCase):
    # def testProvideCard(self):
    #     p1 = player()
    #     p2 = player()
    #     p3 = player()
    #     p4 = player()
    #     game = Game(p1,p2,p3,p4)
    #     pass
    def testSetGameScore(self):
        p1 = player("p1")
        p2 = player("p2")
        p3 = player("p3")
        p4 = player("p4")
        game = Game(p1,p2,p3,p4)
        game.setGameScore()
        
        self.assertEqual(game.player1.getGameScore(),0 )
        self.assertEqual(game.player2.getGameScore(),0 )
        self.assertEqual(game.player3.getGameScore(),0 )
        self.assertEqual(game.player4.getGameScore(),0)


       

# Run the tests
if __name__ == '__main__':
    unittest.main()