import unittest
import sys
sys.path.append('C:\\Users\\User\\Desktop\\gameEnvironment\\gameEnvironment\\gameEngine')

from gameEnvironment import *


class test_setFriendCard(unittest.TestCase):
    def test_setFriendCard_should_get_friend_card_that_not_in_BidWinner_hand(self):
       
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
        self.assertNotEqual(game.getFriendCard(),None)
        

# Run the tests
if __name__ == '__main__':
    unittest.main()