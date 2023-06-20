from FCG_terminer_ver.core.FCG_core import *
import unittest
import traceback
class test_calculateMatchscore(unittest.TestCase):
    def test_calculateMatchScore_should_give_correct_point_to_player_if_friend_team_is_winner(self):
        p1 = player("p1",0)
        p2 = player("p2",1)
        p3 = player("p3",2)
        p4 = player("p4",3)
        game = Game(p1,p2,p3,p4)
        friendPlayer = game.getPlayer(1)
        game.setFriendPlayer(friendPlayer)
        game.setBidWinnerIndex(0)
        game.setBidScore(60)
        game.identifyTeam()
        game.setWinnerTeam(0)
         #---------------------------------------------------
        bidWinnerGameScore = 25
        friendGameScore  = 25
        otherPlayerGameScore1 =25
        otherPlayerGameScore2 = 25
        bidScore = 60      
         #-----------------------------------------------------
     
        game.getPlayer(0).setGameScore(bidWinnerGameScore)
        game.getPlayer(1).setGameScore(friendGameScore)
        game.getPlayer(2).setGameScore(otherPlayerGameScore1)
        game.getPlayer(3).setGameScore(otherPlayerGameScore2)     
        #-----------------------------------------------------
        game.calculateMatchScore()
        #------------------------------------------------------
        bidWinnerMatchScore = game.getPlayer(0).getMatchScore()
        friendMatchScore  = game.getPlayer(1).getMatchScore()
        otherPlayerMatchScore1 = game.getPlayer(2).getMatchScore()
        otherPlayerMatchScore2 = game.getPlayer(3).getMatchScore()
       
       
        self.assertEqual(bidWinnerMatchScore,85)
        self.assertEqual(friendMatchScore,55)
        self.assertEqual(otherPlayerMatchScore1,-40)
        self.assertEqual(otherPlayerMatchScore1,-40)
    def test_calculateMatchScore_should_give_correct_point_to_player_if_friend_team_is_loser(self):
        p1 = player("p1",0)
        p2 = player("p2",1)
        p3 = player("p3",2)
        p4 = player("p4",3)
        game = Game(p1,p2,p3,p4)
        friendPlayer = game.getPlayer(1)
        game.setFriendPlayer(friendPlayer)
        game.setBidWinnerIndex(0)
        game.setBidScore(60)
        game.identifyTeam()
        game.setWinnerTeam(1)
         #---------------------------------------------------
        bidWinnerGameScore = 25
        friendGameScore  = 25
        otherPlayerGameScore1 =25
        otherPlayerGameScore2 = 25
        bidScore = 60      
         #-----------------------------------------------------
     
        game.getPlayer(0).setGameScore(bidWinnerGameScore)
        game.getPlayer(1).setGameScore(friendGameScore)
        game.getPlayer(2).setGameScore(otherPlayerGameScore1)
        game.getPlayer(3).setGameScore(otherPlayerGameScore2)     
        #-----------------------------------------------------
        game.calculateMatchScore()
        #------------------------------------------------------
        bidWinnerMatchScore = game.getPlayer(0).getMatchScore()
        friendMatchScore  = game.getPlayer(1).getMatchScore()
        otherPlayerMatchScore1 = game.getPlayer(2).getMatchScore()
        otherPlayerMatchScore2 = game.getPlayer(3).getMatchScore()
       
       
        self.assertEqual(bidWinnerMatchScore,-60)
        self.assertEqual(friendMatchScore,-5)
        self.assertEqual(otherPlayerMatchScore1,25)
        self.assertEqual(otherPlayerMatchScore1,25)
    def test_calculateMatchScore_should_give_correct_point_to_player_if_friend_team_is_loser_but_friend_get_0_penalty_point(self):
        p1 = player("p1",0)
        p2 = player("p2",1)
        p3 = player("p3",2)
        p4 = player("p4",3)
        game = Game(p1,p2,p3,p4)
        friendPlayer = game.getPlayer(1)
        game.setFriendPlayer(friendPlayer)
        game.setBidWinnerIndex(0)
        game.setBidScore(60)
        game.identifyTeam()
        game.setWinnerTeam(1)
         #---------------------------------------------------
        bidWinnerGameScore = 15
        friendGameScore  = 35
        otherPlayerGameScore1 =25
        otherPlayerGameScore2 = 25
        bidScore = 60      
         #-----------------------------------------------------
     
        game.getPlayer(0).setGameScore(bidWinnerGameScore)
        game.getPlayer(1).setGameScore(friendGameScore)
        game.getPlayer(2).setGameScore(otherPlayerGameScore1)
        game.getPlayer(3).setGameScore(otherPlayerGameScore2)     
        #-----------------------------------------------------
        game.calculateMatchScore()
        #------------------------------------------------------
        bidWinnerMatchScore = game.getPlayer(0).getMatchScore()
        friendMatchScore  = game.getPlayer(1).getMatchScore()
        otherPlayerMatchScore1 = game.getPlayer(2).getMatchScore()
        otherPlayerMatchScore2 = game.getPlayer(3).getMatchScore()
       
       
        self.assertEqual(bidWinnerMatchScore,-60)
        self.assertEqual(friendMatchScore,0)
        self.assertEqual(otherPlayerMatchScore1,25)
        self.assertEqual(otherPlayerMatchScore1,25)
        
        
            
        
       
        
# Run the tests
if __name__ == '__main__':
    unittest.main()