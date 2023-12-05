import numpy as np
def notViolateRule(state_tensor,action):
    state_array = state_tensor.numpy()
    cardInhand = state_array[0:28]
    # print(cardInhand)
    # print(action)
    leadingSuite = state_array[28:32]
    trumpSuite = state_array[32:36]
   
    # check if card is in hand
    if not isCardInhand(cardInhand,action):
        return False
    # check if it is a leading card otherwise check if card follow leading card
    if isLeadingAction(leadingSuite):
        return True
    if isFollowLeading(leadingSuite,action):
        return True
    # check if card is a trump
    # if self.isTrumpcard(trumpSuite,action):
    #     return True
    # check if void card
    if isVoidCard(cardInhand,leadingSuite):
        return True
    return False
def isCardInhand(cards,action):
        # print(action)
    row_index = int(action / 7)
    #  print(row_index)

    col_index = int(action%7)
    # points = [0,5,10,'J','Q','K','A']
    # smallPoints = [2,3,4,5,6,7,8,9,10,'J','Q','K','A']
    # mapActToOut = {0:[0,1,2,4,5,6,7],1:[3],2:[8],3:[9],4:[10],5:[11],6:[12]}
    # print(mapActToOut[col_index])
    # for i in range(len(mapActToOut[col_index])):
    #     if (cards[(row_index*7)+mapActToOut[col_index][i]]==1):
    #         return True
    # return False
    if cards[row_index*7 + col_index]==1:
        return True
    return False
def isTrumpcard(trump,action):
    row_index = int(action / 7)
    if trump[row_index]==1:
        return True
    return False
def isVoidCard(cards,leadingSuite):

    leadingSuiteIndex = np.where(leadingSuite == 1)
    leadingSuiteIndex = leadingSuiteIndex[0][0]
    # print(leadingSuiteIndex)
    for i in range(7):
        if cards[leadingSuiteIndex*7+i]==1:
            return False
    return True

def isFollowLeading(leadingSuite,action):
    row_index = int(action / 7)
    if leadingSuite[row_index]==1:
        return True
    return False
def isLeadingAction(leadingSuite):
    if all(suite == 0 for suite in leadingSuite):
        return True
    return False