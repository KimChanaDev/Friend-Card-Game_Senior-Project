class NotValidDroppedCardError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

if __name__ == '__main__':
    unittest.main()