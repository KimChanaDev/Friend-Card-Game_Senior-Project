import unittest
import sys
sys.path.append('C:\\Users\\User\\Desktop\\gameEnvironment\\gameEnvironment\\gameEngine')

from gameEnvironment import *


class test_provideCard(unittest.TestCase):
    def test_provideCard_should_make_player_get_distinct_13_card(self):
        sets = []
        p1 = player("p1")
        p2 = player("p2")
        p3 = player("p3")
        p4 = player("p4")
        game = Game(p1,p2,p3,p4)
        game.provideCard()
        sets.append(game.getPlayer(0).getAllCard())
        sets.append(game.getPlayer(1).getAllCard())
        sets.append(game.getPlayer(2).getAllCard())
        sets.append(game.getPlayer(3).getAllCard())
        self.assertTrue(all(set1.isdisjoint(set2) for set1 in sets for set2 in sets if set1 != set2))
        self.assertEqual(len(game.getPlayer(0).getAllCard()),13)
        self.assertEqual(len(game.getPlayer(1).getAllCard()),13)
        self.assertEqual(len(game.getPlayer(2).getAllCard()),13)
        self.assertEqual(len(game.getPlayer(3).getAllCard()),13)
   

        
       

       

# Run the tests
if __name__ == '__main__':
    unittest.main()