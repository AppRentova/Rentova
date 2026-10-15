import { NextResponse } from "next/server";import { getVehicle } from "../../../../../lib/vehicles";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const vehicle=getVehicle(id);return vehicle?NextResponse.json({data:vehicle,meta:{provider:"mock"}}):NextResponse.json({error:{code:"NOT_FOUND",message:"Vehicle not found"}},{status:404})}
