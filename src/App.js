import { useState } from 'react';
import { Button, ChakraProvider, Box, VStack, Text, Flex} from '@chakra-ui/react';
import { createSlice, configureStore } from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux';


const tictactoe = createSlice ({
    name: "tictactoe",
    initialState:{
        squares: Array(9).fill(null),
        currentStep: 0,
        winner: null,
        nextValue: 'X',
        status: 'Next player: X',
    },
    reducers:{
      selectSquare: (state, action)=>{
        if (!state.winner && !state.squares[action.payload]){
           const newSquares = [...state.squares]
           newSquares[action.payload] = calculateNextValue(newSquares)
           const nextValue = calculateNextValue(newSquares)
           const winner = calculateWinner(newSquares)
           const status = calculateStatus(winner, newSquares, nextValue)
            return {
              squares: newSquares,
              winner,
              nextValue,
              status
            }        
        }              
      },
      restart: () => {
          const newSquares = Array(9).fill(null)
          const nextValue = calculateNextValue(newSquares)
          const winner = calculateWinner(newSquares)
          const status = calculateStatus(winner, newSquares, nextValue)

          return {
            squares: newSquares,
            winner,
            nextValue,
            status
          }   
      }

    } 
    
})

const {selectSquare, restart} = tictactoe.actions


const store = configureStore({
  reducer: {
    reducer: tictactoe.reducer,
  },
})
function Board() {

  const {status, squares} = useSelector(state=> state.reducer);
  
  const dispatch = useDispatch();

  function selectSquareHandler(squareIndex){
    dispatch(selectSquare(squareIndex))
  }
  // const [squares, setSequares] = useState(Array(9).fill(null))

  // const nextValue = calculateNextValue(squares)
  // const winner = calculateWinner(squares)
  // const status = calculateStatus(winner, squares, nextValue)



  // function selectSquare(square) {
  //   if (winner || squares[square]){
  //     return;
  //   }

  //   const squaresCopy = [...squares];
  //   squaresCopy[square] = nextValue;
  //   setSequares(squaresCopy)

  // }

  // function restart() {
  //   setSequares(Array(9).fill(null))
  // }

  function renderSquare(i) {
    return (
      <Button 
        w='100px'
        h='100px'
        variant="outline"
        borderWidth="4px"
        borderColor="gray.400"
        fontSize="4xl" 
        onClick={() => selectSquareHandler(i)} >
        {squares[i]}
      </Button>
    
    );
  }

  return (
    <VStack >
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        {status}
      </Text>
      <Flex >
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </Flex>
      <Flex mt={["-0rem !important"]} >
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </Flex>
      <Flex mt={["-0rem !important"]} >
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </Flex>
    </VStack>
  
  );
}

function Game() {
  const dispatch = useDispatch();

  function handleRestart(){
    dispatch(restart())
  }
  return (
    <>
      <Box bg="gray.100" h='100vh' p={10}>
        <Box maxW="md"  mx="auto" p={6} bg="white" borderRadius={'lg'}>
             <Board />
             <VStack >
               <Button fontSize="xl" size="md"  onClick={handleRestart} mt={4}  colorScheme= 'teal' >
                Restart
              </Button>
             </VStack>
        </Box>
      </Box>
    </>
  );
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`;
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return (
    <ChakraProvider>
      <Provider store = {store}>
        <Game />
      </Provider>
    </ChakraProvider>  
  )
}

export default App;
