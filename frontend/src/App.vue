<template>
  <div class="m-2">
     <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <img class="w-full" src="https://placekitten.com/200/100" />
        <div class="px-6 py-4">
           <div class="font-bold text-xl mb-2">Compteur</div>
           <p class="text-gray-700 text-5xl">
              {{count}}
           </p>
        </div>
        <div class="px-6 pt-4 pb-2">
           <button type="button" @click="increment" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Incrémenter
           </button>
           <button type="button" @click="decrement" class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Décrémenter
           </button>
           <button type="button" @click="play" class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Jouer
           </button>
        </div>
     </div>
  </div>
</template>

<script setup>
   import { ref } from "vue"
   import { Chess } from 'chess.js'

   const count = ref(0)

   const increment = () => {
      count.value += 1
   }

   const decrement = () => {
      count.value -= 1
   }

   function play() {
      const chess = new Chess()

      while (!chess.isGameOver()) {
         const moves = chess.moves()
         const move = moves[Math.floor(Math.random() * moves.length)]
         chess.move(move)
      }
      console.log(chess.pgn())
   }
</script>
