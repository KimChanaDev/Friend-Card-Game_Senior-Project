import unittest
from GameEnvironment.gameEngine.gameEnvironment import *


class test_isTeamMember(unittest.TestCase):
    def test_getBuddy_should_return_buddy_if_given_player_is_exactly_in(self):
        P1 = player('jare',0)
        P2 = player('jarun',1)
        Team = team(P1,P2,50)
        self.assertEqual(Team.getBuddy(P1),P2)
    def test_getBuddy_should_return_false_if_given_player_is_not_exactly_in(self):
        P1 = player('jare',0)
        P2 = player('jarun',1)
        P3 = player('jarun',2)
        P4 = player('jaja',0)
        P5 = player('gere',4)
        Team = team(P1,P2,50)
        self.assertFalse(Team.getBuddy(P3))
     
       
# Run the tests
if __name__ == '__main__':
    unittest.main()