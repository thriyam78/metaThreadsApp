"use server"
import { connectToDB }  from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { Children } from "react";
import { getJsPageSizeInKb } from "next/dist/build/utils";
import { FilterQuery, SortOrder } from "mongoose";
interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
  }
  
  export async function updateUser({
    userId,
    bio,
    name,
    path,
    username,
    image,
  }: Params): Promise<void> {
    
    try {
      connectToDB();
  
      await User.findOneAndUpdate(
        { id: userId },
        {
          username: username.toLowerCase(),
          name,
          bio,
          image,
          onboarded: true,
        },
        { upsert: true }
      );
  
      if (path === "/profile/edit") {
        revalidatePath(path);
      }
    } catch (error) {
      console.log(error);
    }
  }

  export async function fetchUser(userId:string) {
    try {
        connectToDB();
        return await User.findOne({id:userId})
        // .populate({path:'communities', model:Community})
    } catch (error) {
        console.log("Failed to fetch user")
        
    }
    
  }

  export async function fetchUserPosts(userId:string){
    try {
      connectToDB()
      //Find all threads authored by user with the given userId

      //ToDO populate community
      const threads=await User.findOne({id:userId}).populate({
        path:"threads",
        model:Thread,
        populate:[{
          path:"children",
          model:Thread,
          populate:{
            path:"author",
            model:User,
            select:"name image id" // Select the "name" and "_id" fields from the "User" model
          }
        }]
      })
      return threads
      
    } catch (error) {
      console.log("Failed to fetch posts")
    }
  }

  export async function fetchUsers({
    userId,
    searchString="",
    PageNumber=1,
    pageSize=20,
    sortBy="desc"
  }:{
    userId:string;
    searchString?:string;
    PageNumber?:number;
    pageSize?:number;
    sortBy?:SortOrder;
  }) {
    try {
      connectToDB();
      const skipAmount=(PageNumber-1) * pageSize;
      const regex=new RegExp(searchString,"i");
      const query:FilterQuery<typeof User>={
        id:{$ne:userId} //$ne is "not equal to"
      }
      if(searchString.trim()!==''){
        query.$or=[
          {username:{$regex:regex}},
          {name:{$regex:regex}},
        ]
      }
      const sortOptions={createdAt:sortBy};
      const userQuery=User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize)
      const TotalUsersCount=await User.countDocuments(query);
      const users=await userQuery.exec();
      const isNext=TotalUsersCount>skipAmount+users.length;  
      return {users,isNext};
    } catch (error) {
      console.log("Failed to fetch users")
      
    }

    
  }

  export async function getActivity(userId:string){
   try {
    connectToDB()
    //Find all the threads created by the user
    const userThreads=await Thread.find({author:userId}) 
    // Collect all the child threads ids (replies) from the children field
    const childThreadIds=userThreads.reduce((acc,userThread)=>{
      return acc.concat(userThread.children)
   },[])
   const replies=await Thread.find({
    _id:{$in:childThreadIds},
    author:{$ne:userId}, })
    .populate({
      path:"author",
      model:User,
      select:"image name _id"
    })
    return replies;
    
   } catch (error) {
    console.log("Failed to fetch the threads")
    
   }
  }