import unittest
from GameEnvironment.gameEngine.gameEnvironment import *


class test_getPlayer(unittest.TestCase):

    def test_getPlayer_should_return_player_at_sameposition_as_input_if_input_is_in_0_and_3(self):
        p1 = player("p1")
        p2 = player("p2")
        p3 = player("p3")
        p4 = player("p4")
        game = Game(p1,p2,p3,p4)
        self.assertIs(game.getPlayer(0),p1)
        self.assertIs(game.getPlayer(3),p4)
    def test_getPlayer_should_raise_valueError_if_input_is_negative(self):
        p1 = player("p1")
        p2 = player("p2")
        p3 = player("p3")
        p4 = player("p4")
        game = Game(p1,p2,p3,p4)
        self.assertRaises(ValueError, game.getPlayer, -42)
    def test_getPlayer_should_raise_valueError_if_input_is_more_than_3(self):
        p1 = player("p1")
        p2 = player("p2")
        p3 = player("p3")
        p4 = player("p4")
        game = Game(p1,p2,p3,p4)
        self.assertRaises(ValueError, game.getPlayer, 4)
        

       

# Run the tests
if __name__ == '__main__':
    unittest.main()