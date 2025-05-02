"use server"

import { db } from "@/server"
import { todos } from "./schema"
import { revalidatePath } from "next/cache"

export const readData = async () => {
    const todos = await db.query.todos.findMany()

    if(!todos) {
        return {data:[],status:200}
    }   

    return {data:todos,status:200}
}


export const createData = async (formData:FormData) => {
    
    const title = formData.get('todoTitle')?.toString() || ""
    
    const todo = await db.insert(todos).values({title})

    if(!todo) {
        return {error:"something wrong",status:500}
    }   

    revalidatePath("/")

    return {success:"Todo Created",status:200}
}