
import type { Request, Response } from "express";
import Note, {IntefaceNote} from "../models/Note";
// import Note, {InterfaceNote} from '../models/Note'


export class NoteContrller {
    static createNote = async (req: Request<{},{}, IntefaceNote>, res: Response)=>{
        const {content} = req.body

    }
}