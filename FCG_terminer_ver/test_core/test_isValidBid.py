from FCG_terminer_ver.core.FCG_core import *
import unittest


class test_takeBidFromPlayer(unittest.TestCase):
    def test_isValidBid_should_return_true_if_player_bid_more_than_previous_bid_that_mod_5_equal_0(self):
        p1 = player("p1",0)
        p2 = player("p2",1)
        p3 = player("p3",2)
        p4 = player("p4",3)
        game = Game(p1,p2,p3,p4)
        previousBid = 50
        game.setBidScore(previousBid)
        currentBid = 55

        self.assertTrue(game.isValidBid(previousBid,currentBid))
    def test_isValidBid_should_return_true_if_player_bid_0(self):
        p1 = player("p1",0)
        p2 = player("p2",1)
        p3 = player("p3",2)
        p4 = player("p4",3)
        game = Game(p1,p2,p3,p4)
        previousBid = 50
        game.setBidScore(previousBid)
        currentBid = 0

        self.assertTrue(game.isValidBid(previousBid,currentBid))
    def test_isValidBid_should_return_false_if_player_bid_less_than_previous_bid(self):
        p1 = player("p1",0)
        p2 = player("p2",1)
        p3 = player("p3",2)
        p4 = player("p4",3)
        game = Game(p1,p2,p3,p4)
        previousBid = 50
        game.setBidScore(previousBid)
        currentBid = 35
        self.assertFalse(game.isValidBid(previousBid,currentBid))
    def test_isValidBid_should_return_false_if_player_bid_rhat_mod_5_not_equal_to_0(self):
        p1 = player("p1",0)
        p2 = player("p2",1)
        p3 = player("p3",2)
        p4 = player("p4",3)
        game = Game(p1,p2,p3,p4)
        previousBid = 50
        game.setBidScore(previousBid)
        currentBid = 67
        self.assertFalse(game.isValidBid(previousBid,currentBid))
       
        
# Run the tests
if __name__ == '__main__':
    unittest.main()