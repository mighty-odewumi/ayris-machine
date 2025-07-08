"use client"

import Image from "next/image";
import PageWithSidebars from "@/components/PageWithSidebars";
import { useProfilePosts } from "@/hooks/useProfilePosts";
import { useFetchUsers } from "@/hooks/useFetchUsers";

export default function Temple() {

  const { posts } = useProfilePosts();
  const { totalCount } = useFetchUsers();

  const content = (
    <div className="vp-temple-container">
      {/* Temple Interface Background */}
      <div className="vp-temple-background">
        <Image src="/assets/profiles-acct.png" alt="Temple background" fill  />
      </div>

      {/* Temple Content */}
      <div className="vp-temple-content">
        <div className="vp-temple-text absolute top-[25%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-white flex justify-between">
          <a href="/profiles">
            PROFILES
          </a>
        </div>

        <div className="vp-temple-text absolute top-[25%] left-[70%] transform -translate-x-1/2 -translate-y-1/2 text-white ">
          <span>{posts.length || 0}</span>
        </div>

        <div className="vp-temple-text absolute top-[75%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-white flex justify-between">
          <a href="/users">
            ACCOUNTS
          </a>
        </div>

        <div className="vp-temple-text absolute top-[75%] left-[70%] transform -translate-x-1/2 -translate-y-1/2 text-white ">
          <span>{totalCount}</span>
        </div>
      </div>
    </div>
  );

  return (
    <> 
      <PageWithSidebars centerContent={content} />
    </>
  )
}