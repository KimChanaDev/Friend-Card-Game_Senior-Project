from FCG_terminer_ver.core.FCG_core import *
import unittest
import traceback
class test_selectTrumpCard(unittest.TestCase):
    def test_selectTrumpCard_should_not_raise_error_if_input_is_valid(self):
        p1 = player("p1",0)
        p2 = player("p2",1)
        p3 = player("p3",2)
        p4 = player("p4",3)
        game = Game(p1,p2,p3,p4)
        game.provideCard()
        game.setBidWinnerIndex(0)
        error = True
        try:
            game.selectTrumpCard()
            error = False
        except Exception as e:
            traceback.print_exc()
        self.assertFalse(error)
            
        
       
        
# Run the tests
if __name__ == '__main__':
    unittest.main()