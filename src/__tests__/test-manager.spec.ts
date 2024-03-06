import request from 'supertest';
import {INestApplication} from '@nestjs/common';
import {correctRegistrationData} from "./registration.data";

export const correctBlogData = {
    name: 'name',
    description: 'description',
    websiteUrl: 'https://TXOxcSX82Olmsdf8sXEHAWm.ZFTe4',
};

export const correctUser1 = {
    login: 'login',
    password: 'password',
    email:'login@mail.ru',
}
export const inCorrectUser1 = {
    login: 'ln',
    password: 'rd',
    email:'logimail.ru',
}
export const correctPostDataCREATEPOSTINBLOGS = {
    title: 'string',
    shortDescription: 'string',
    content: 'string',
};
const SUPERADMIN_TOKEN = 'Basic YWRtaW46cXdlcnR5'

export class TestManager {
    private blog_1: any;
    private blog_1_id: string;
    private post_1: any;
    private post_1_id: string;
    private static app: INestApplication;

    constructor(protected readonly app: INestApplication,
                protected readonly httpServer: any,) {
    }

    async getBlog(blogId: string) {
        this.blog_1_id = JSON.parse(this.blog_1.text)['id'];
        const getOneBlog = await request(this.app.getHttpServer()).get(`/blogs/${blogId}`);
        expect(JSON.parse(getOneBlog.text)).toEqual({
            id: expect.any(String),
            name: correctBlogData.name,
            description: correctBlogData.description,
            websiteUrl: correctBlogData.websiteUrl,
            isMembership: false,
            createdAt: expect.any(String),
        });
        return JSON.parse(getOneBlog.text);
    }

    async getPostsByBlogId(blogId: string) {
        console.log(blogId, 'blogid');
        const response = await request(this.app.getHttpServer()).get(`/blogs/${blogId}/posts`);
        expect(response.text).toEqual('fsdfdssdf');
        expect(JSON.parse(response.text)).toEqual('fsdfdssdf');
    }

    async getBlogs(
        searchNameTerm?: string,
        sortBy?: string,
        sortDirection?: string,
        pageSize?: number,
        pageNumber?: number,
    ) {
        const response = await request(this.app.getHttpServer()).get(
            // `/blogs?searchNameTerm=${searchNameTerm}`,
            `/blogs?pageSize=${pageSize}&pageNumber=${pageNumber}`,
        );
        return JSON.parse(response.text);
    }

    async createPostInPost(blogId: string) {
        const s = {...correctPostDataCREATEPOSTINBLOGS};
        s['blogId'] = blogId;
        this.post_1 = await request(this.app.getHttpServer()).post(`/posts`).send(s);
        return JSON.parse(this.post_1.text);
    }

    async deletePost(postId: string) {
        this.post_1 = await request(this.app.getHttpServer()).delete(`/posts/${postId}`);
        return JSON.parse(this.post_1.text);
    }

    async craetePostByBlogId(blogId: string) {
        // correctPostDataCREATEPOSTINBLOGS.blogId = this.blog_1_id;
        this.post_1 = await request(this.app.getHttpServer())
            .post(`/blogs/${blogId}/posts`)
            .send(correctPostDataCREATEPOSTINBLOGS);
        // expect(JSON.parse(this.post_1.text)).toEqual({
        //   id: expect.any(String),
        //   title: expect.any(String),
        //   shortDescription: expect.any(String),
        //   content: expect.any(String),
        //   blogId: this.blog_1_id,
        //   blogName: correctBlogData.name,
        //   createdAt: expect.any(String),
        //   extendedLikesInfo: {
        //     likesCount: 0,
        //     dislikesCount: 0,
        //     myStatus: 'None',
        //     newestLikes: [
        //       // {
        //       //   addedAt: '2024-02-28T17:02:42.877Z',
        //       //   userId: 'string',
        //       //   login: 'string',
        //       // },
        //     ],
        //   },
        // });
        this.post_1_id = JSON.parse(this.post_1.text)['id'];
        return JSON.parse(this.post_1.text);
    }

    async getPost(postId: string) {
        this.post_1_id = JSON.parse(this.post_1.text)['id'];
        const getOnePost = await request(this.app.getHttpServer()).get(`/posts/${postId}`);
        expect(JSON.parse(getOnePost.text)).toEqual({
            id: expect.any(String),
            title: expect.any(String),
            shortDescription: expect.any(String),
            content: expect.any(String),
            blogId: this.blog_1_id,
            blogName: correctBlogData.name,
            createdAt: expect.any(String),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: [
                    // {
                    //   addedAt: '2024-02-28T17:02:42.877Z',
                    //   userId: 'string',
                    //   login: 'string',
                    // },
                ],
            },
        });
        return JSON.parse(getOnePost.text);
    }
    async getPosts() {
        const getOnePost = await request(this.app.getHttpServer()).get(`/posts`);
        expect(JSON.parse(getOnePost.text)).toEqual([]);
    }

    async deleteAll() {
        await request(this.httpServer).delete('/testing/all-data').expect(204);
    }
    async testFunc(refreshToken:string) {
        let s  =await request(this.httpServer).get('/auth/test')
            .set('Cookie', [refreshToken])
        expect(s).toEqual('sasda')
    }

    async updatePost(postId: string, blogId: string) {
        const p = {...correctPostDataCREATEPOSTINBLOGS};
        p['blogId'] = blogId;
        this.blog_1 = await request(this.app.getHttpServer())
            .put(`/posts/${postId}`)
            .send(p)
            .expect(203);
        // return this.blog_1.text;
    }

    async createBlog(name: string = 'string') {
        this.blog_1 = await request(this.httpServer)
            .post('/blogs')
            .send({...correctBlogData, name});

        return JSON.parse(this.blog_1.text);
    }
    async getUsers(searchLoginTerm?:string,searchEmailTerm?:string,pageSize?:number, pageNumber?:number,sortBy?:string, sortDirection?:string) {
        const getUsers =
        await request(this.httpServer).get(`/users?sortBy=${sortBy}&sortDirection=${sortDirection}`);
        // await request(this.httpServer).get(`/users?searchEmailTerm=${searchEmailTerm}&pageSize=${pageSize}&pageNumber=${pageNumber}`);
        // await request(this.httpServer).get(`/users?searchNameTerm=${searchNameTerm}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
        return JSON.parse(getUsers.text)
    }
    async createUserBySuperAdmin(userData:any) {
        const reponse = await request(this.httpServer)
            .post('/users')
            .set('Authorization', `${SUPERADMIN_TOKEN}`)
            .send(userData);

        return JSON.parse(reponse.text);
    }
    async deleteUserBySuperAdmin(userId:string) {
        const reponse = await request(this.httpServer)
            .delete(`/users/${userId}`)
            .set('Authorization', `${SUPERADMIN_TOKEN}`)

        return reponse.status;
    }

    async loginCreatedUserBySuperAdmin(loginCorrectData:any){
        const response = await request(this.httpServer)
            .post('/auth/login')
            .send(loginCorrectData)

        // return JSON.parse(response.text)
        return  response
    }

    async registration(data){
        const response = await request(this.httpServer)
            .post('/auth/registration')
            .send(data)
        return response
    }


    async registrationEmailResending(data){
        const response = await request(this.httpServer)
            .post('/auth/registration-email-resending')
            .send({email:data})
        return response
    }

    async registrationConfirmation(data){
        const response = await request(this.httpServer)
            .post('/auth/registration-confirmation')
            .send({code:data})
        return response
    }



}
