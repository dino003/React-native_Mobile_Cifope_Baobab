import axios from 'axios'

const base = 'http://127.0.0.1:3000/api/'


export function getArticles(page){
    const url = base + 'index_article_admin"&page=' + page
}