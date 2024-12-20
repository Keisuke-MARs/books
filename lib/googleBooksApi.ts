/* eslint-disable @typescript-eslint/no-explicit-any */
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
const API_URL = 'https://www.googleapis.com/books/v1/volumes';

export interface BookSearchResult {
    id: string;
    title: string;
    authors: string[];
    publishedDate: string;
    description: string;
    imageLinks?: {
        thumbnail: string;
    };
    industryIdentifiers?: Array<{
        type: string;
        identifier: string;
    }>;
}

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}`);

    if (!response.ok) {
        throw new Error('書籍の検索に失敗しました');
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || [],
        publishedDate: item.volumeInfo.publishedDate,
        description: item.volumeInfo.description || '',
        imageLinks: item.volumeInfo.imageLinks,
        industryIdentifiers: item.volumeInfo.industryIdentifiers,
    }));
}

