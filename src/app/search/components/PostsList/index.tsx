import React from 'react';
import PostCard from './PostCard';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import { Post } from '@/types/post';

interface PostsListProps {
  posts: Post[];
  loading: boolean;
}

export default function PostsList({ posts, loading }: PostsListProps) {
  if (loading) {
    return <LoadingState />;
  }
  
  if (posts.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}