import { main } from "@/helpers/banana";
import { generatePrompt } from "@/helpers/prompt";
import { NextRequest, NextResponse } from "next/server";

export interface updateData{
  title?:string;
  description?:string;
  position?:string;
  base64?:string;
  isFile?: boolean;
}

export async function POST(req:NextRequest) {
  try {
    const formData = await req.formData();
    const data: updateData = {isFile:false};
    data.title = formData.get('title') as string;
    data.description = formData.get('description') as string;
    data.position = formData.get('position') as string;
    if(formData.has('image')){
      data.isFile = true;
      const file = formData.get('image') as File;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      data.base64 = buffer.toString("base64");
    }
    const prompt=await generatePrompt(data);
    if(!prompt){
      return  NextResponse.json({ message: 'Something went wrong' },{status:500});
    }
    const thumbnail=await main(prompt, data.base64);
    return new Response(JSON.stringify({message:'Data received',thumbnail}), {status: 200});
  } catch (error) {
    console.error(error);
    //@ts-expect-error: unknown
    return NextResponse.json({ message: error.message },{status:500});
  }
}