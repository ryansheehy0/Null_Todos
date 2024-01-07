import { saveAs } from "file-saver"
import transact from "./transaction"

async function readFile(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = function(event){
      resolve(event.target?.result)
    }
    reader.onerror = function(event){
      reject(event)
    }
    reader.readAsText(file)
  })
}

function isObjBoard(obj){
  return (
    "name" in obj && typeof obj.name === "string" &&
    "lists" in obj && Array.isArray(obj.lists) && obj.lists.every(list => typeof list === "number") &&
    "id" in obj && typeof obj.id === "number"
  )
}

function isObjList(obj){
  return (
    "name" in obj && typeof obj.name === "string" &&
    "cards" in obj && Array.isArray(obj.cards) && obj.cards.every(card => typeof card === "number") &&
    "id" in obj && typeof obj.id === "number"
  )
}

function isObjCard(obj){
  return (
    "name" in obj && typeof obj.name === "string" &&
    "cards" in obj && Array.isArray(obj.cards) && obj.cards.every(card => typeof card === "number") &&
    "parentId" in obj && typeof obj.parentId === "number" &&
    "parentType" in obj && typeof obj.parentType === "string" && (obj.parentType === "card" || obj.parentType === "list") &&
    "id" in obj && typeof obj.id === "number"
  )
}

function isObjUploadedObj(obj){
  return (
    "boards" in obj && Array.isArray(obj.boards) && obj.boards.every(board => isObjBoard(board)) &&
    "lists" in obj && Array.isArray(obj.lists) && obj.lists.every(list => isObjList(list)) &&
    "cards" in obj && Array.isArray(obj.cards) && obj.cards.every(card => isObjCard(card))
  )
}

export async function upload(db, event){
  try{
    // Get the uploaded file
    const uploadedFile =  event.target.files[0]
    const uploadedJson = await readFile(uploadedFile)
    // Convert json to obj
    const uploadedObj = JSON.parse(uploadedJson)
    // Validate input file is correct
    if(!isObjUploadedObj(uploadedObj)) return
    // Set db with values from the object
    await transact(db, async () => {
      // Add boards
      await db.boards.clear()
      for(const board of uploadedObj.boards){
        await db.boards.add(board)
      }
      // Add lists
      await db.lists.clear()
      for(const list of uploadedObj.lists){
        await db.lists.add(list)
      }
      // Add cards
      await db.cards.clear()
      for(const card of uploadedObj.cards){
        await db.cards.add(card)
      }
    })
  }catch(error){
    console.error(error)
  }finally{
    // Reset value so onChange runs again
    event.target.value = ""
  }
}

export async function download(db){
  const boards = await db.boards.toArray()
  const lists = await db.lists.toArray()
  const cards = await db.cards.toArray()
  const downloadObj = {
    boards,
    lists,
    cards
  }

  const downloadJson = JSON.stringify(downloadObj, null, 2)
  const blob = new Blob([downloadJson], { type: "application/json"})
  saveAs(blob, "null_todos.json")
}