import { ENTITIES, LIKE_STATUSES, TestManager } from "./test-manager.spec";
import mongoose from "mongoose";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { appSettings } from "../app.settings";
import { AuthController } from "../auth/presentation/auth.controller";
import {
  correctLoginData,
  correctLoginData_SECOND_USER, correctLoginData_USER_3, correctLoginData_USER_4,
  correctRegistrationData,
  correctRegistrationDataSECONDYSER, USER_3, USER_4,
} from "./registration.data";
import { UserForTestModel } from "../users/domain/users-schema";

describe("Blogs", () => {
  let app: INestApplication;
  let testManager: TestManager;
  let httpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthController)
      .useClass(AuthController)
      .compile();
    app = moduleFixture.createNestApplication();
    appSettings(app);
    await app.init();

    httpServer = app.getHttpServer();
    testManager = new TestManager(app, httpServer);
  });

  const mongoURI = process.env.MONGO_NEST_URL as string;
  beforeAll(async () => {
    await mongoose.connect(mongoURI);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  afterAll(async () => {
    await app.close();
  });
  it("TEST DELETE ALL", async () => {
    await testManager.deleteAll();
  });

  const confirmationCode = "1234";
// #TESTSTART
  describe("Posts LIKESTATUS", () => {

    it("TEST DELETE ALL", async () => {
      await testManager.deleteAll();
    });

    it("Correct registration expect 204", async () => {
      const reponse: any = await testManager.registration(correctRegistrationData);
      expect(reponse.status).toEqual(204);
    });
    it("Correct registration SECOND USER expect 204", async () => {
      const reponse: any = await testManager.registration(correctRegistrationDataSECONDYSER);
      expect(reponse.status).toEqual(204);
    });

    it("Correct registration SECOND USER expect 204", async () => {
      const reponse: any = await testManager.registration(USER_3);
      expect(reponse.status).toEqual(204);
    });
    it("Correct registration SECOND USER expect 204", async () => {
      const reponse: any = await testManager.registration(USER_4);
      expect(reponse.status).toEqual(204);
    });

    let accessToken_2:string
    it("Correct LOGIN SECOND should return true", async () => {
      const reponse: any = await testManager.loginCreatedUserByRegistration(correctLoginData_SECOND_USER);
      accessToken_2 = reponse.accessToken
      expect(reponse).toEqual(204);
    });
    let accessToken_3:string
    it("Correct LOGIN SECOND should return true", async () => {
      const reponse: any = await testManager.loginCreatedUserByRegistration(correctLoginData_USER_3);
      accessToken_3 = reponse.accessToken
      expect(reponse).toEqual(204);
    });

    let accessToken_4:string
    it("Correct LOGIN SECOND should return true", async () => {
      const reponse: any = await testManager.loginCreatedUserByRegistration(correctLoginData_USER_4);
      accessToken_4 = reponse.accessToken
      expect(reponse).toEqual(204);
    });
    it("Correct RegistrationConfirmation should return true", async () => {
      const reponse: any = await testManager.registrationConfirmation(confirmationCode);
      expect(reponse).toEqual(204);
    });
    let accessToken:string
    it("Correct loginCreatedUserByRegistration should return true", async () => {
      const reponse: any = await testManager.loginCreatedUserByRegistration(correctLoginData);
      accessToken = reponse.accessToken
      expect(reponse).toEqual(204);
    });

    let blogId_One: any;
    it(`CREATE BLOG`, async () => {
      const response = await testManager.createBlog("string");
      blogId_One = response.id;

      expect(blogId_One).toEqual("Some Blog Id");
    });

    let postId_One: any;
    let POST_2:any
    let POST_3:any
    let POST_4:any
    let POST_5:any
    let POST_6:any

    it(`CREATE POST_2 BY BLOG ID`, async () => {
      const postResp = await testManager.craetePostByBlogId(blogId_One);
      postId_One = postResp.id
      expect(postId_One).toEqual("Some POst Id");
    });
    // it(`CREATE POST_2 BY BLOG ID`, async () => {
    //   const postResp = await testManager.craetePostByBlogId(blogId_One);
    //   POST_2 = postResp.id
    //   expect(postId_One).toEqual("Some POst Id");
    // });
    //
    // it(`CREATE POST_3 BY BLOG ID`, async () => {
    //   const postResp = await testManager.craetePostByBlogId(blogId_One);
    //   POST_3 = postResp.id
    //   expect(POST_3).toEqual("POST_3 POst Id");
    // });
    //
    // it(`CREATE POST_4 BY BLOG ID`, async () => {
    //   const postResp = await testManager.craetePostByBlogId(blogId_One);
    //   POST_4 = postResp.id
    //   console.log(POST_4, "POST_4");
    //   expect(POST_4).toEqual("POST_4 POst Id");
    // });
    //
    // it(`CREATE POST_5 BY BLOG ID`, async () => {
    //   const postResp = await testManager.craetePostByBlogId(blogId_One);
    //   POST_5 = postResp.id
    //   console.log(POST_5, "postId_One");
    //   expect(POST_5).toEqual("Some POST_5 Id");
    // });
    //
    // it(`CREATE POST_6 BY BLOG ID`, async () => {
    //   const postResp = await testManager.craetePostByBlogId(blogId_One);
    //   POST_6 = postResp.id
    //   console.log(POST_6, "POST_6");
    //   expect(POST_6).toEqual("Some POst Id");
    // });


    it('LIKE POST1 BY  USER 1', async () => {
      const postData = await testManager.likeEntity(
        ENTITIES.POSTS, accessToken,
        postId_One, LIKE_STATUSES.NONE)
      console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
      // console.log('LIKE COMMENT', 'comment', comment)
      expect(postData).toEqual('status')
    });

    // it('LIKE POST1 BY  USER 2', async () => {
    //   const postData = await testManager.likeEntity(
    //     ENTITIES.POSTS, accessToken_2,
    //     postId_One, LIKE_STATUSES.LIKE)
    //   console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
    //   // console.log('LIKE COMMENT', 'comment', comment)
    //   expect(JSON.parse(postData.text)).toEqual('some')
    // });
    // it('LIKE POST2 BY  USER 2', async () => {
    //   const postData = await testManager.likeEntity(
    //     ENTITIES.POSTS, accessToken_2,
    //     POST_2, LIKE_STATUSES.LIKE)
    //   console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
    //   // console.log('LIKE COMMENT', 'comment', comment)
    //   expect(JSON.parse(postData.text)).toEqual('some')
    // });
    // it('LIKE POST2 BY  USER 3', async () => {
    //   const postData = await testManager.likeEntity(
    //     ENTITIES.POSTS, accessToken_3,
    //     POST_2, LIKE_STATUSES.LIKE)
    //   console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
    //   // console.log('LIKE COMMENT', 'comment', comment)
    //   expect(JSON.parse(postData.text)).toEqual('some')
    // });
    // it('DISLIKE POST_3 BY  accessToken 3', async () => {
    //   const postData = await testManager.likeEntity(
    //     ENTITIES.POSTS, accessToken,
    //     POST_3, LIKE_STATUSES.DISLIKE)
    //   console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
    //   // console.log('LIKE COMMENT', 'comment', comment)
    //   expect(JSON.parse(postData.text)).toEqual('some')
    // });
    // it('LIKE POST4 BY  accessToken', async () => {
    //   const postData = await testManager.likeEntity(
    //     ENTITIES.POSTS, accessToken,
    //     POST_4, LIKE_STATUSES.LIKE)
    //   console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
    //   // console.log('LIKE COMMENT', 'comment', comment)
    //   expect(JSON.parse(postData.text)).toEqual('some')
    // });
    // it('LIKE POST4 BY  accessToken', async () => {
    //   const postData = await testManager.likeEntity(
    //     ENTITIES.POSTS, accessToken,
    //     POST_4, LIKE_STATUSES.LIKE)
    //   console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
    //   // console.log('LIKE COMMENT', 'comment', comment)
    //   expect(JSON.parse(postData.text)).toEqual('some')
    // });
    // it('LIKE POST4 BY  accessToken', async () => {
    //   const postData = await testManager.likeEntity(
    //     ENTITIES.POSTS, accessToken_4,
    //     POST_4, LIKE_STATUSES.LIKE)
    //   console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
    //   // console.log('LIKE COMMENT', 'comment', comment)
    //   expect(JSON.parse(postData.text)).toEqual('some')
    // });
    // it('LIKE POST4 BY  accessToken', async () => {
    //   const postData = await testManager.likeEntity(
    //     ENTITIES.POSTS, accessToken_2,
    //     POST_4, LIKE_STATUSES.LIKE)
    //   console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
    //   // console.log('LIKE COMMENT', 'comment', comment)
    //   expect(JSON.parse(postData.text)).toEqual('some')
    // });
    //
    // it('LIKE POST4 BY  accessToken', async () => {
    //   const postData = await testManager.likeEntity(
    //     ENTITIES.POSTS, accessToken_3,
    //     POST_4, LIKE_STATUSES.LIKE)
    //   console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
    //   // console.log('LIKE COMMENT', 'comment', comment)
    //   expect(JSON.parse(postData.text)).toEqual('some')
    // });
    //
    //
    // it('LIKE POST_5 BY  accessToken_2', async () => {
    //   const postData = await testManager.likeEntity(
    //     ENTITIES.POSTS, accessToken_2,
    //     POST_5, LIKE_STATUSES.LIKE)
    //   console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
    //   // console.log('LIKE COMMENT', 'comment', comment)
    //   expect(JSON.parse(postData.text)).toEqual('some')
    // });
    //
    //
    //
    // it('DISLIKE POST_5 BY  accessToken_3', async () => {
    //   const postData = await testManager.likeEntity(
    //     ENTITIES.POSTS, accessToken_3,
    //     POST_5, LIKE_STATUSES.DISLIKE)
    //   console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
    //   // console.log('LIKE COMMENT', 'comment', comment)
    //   expect(JSON.parse(postData.text)).toEqual('some')
    // });
    // it('LIKE POST_5 BY  accessToken', async () => {
    //   const postData = await testManager.likeEntity(
    //     ENTITIES.POSTS, accessToken,
    //     POST_6, LIKE_STATUSES.LIKE)
    //   console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
    //   // console.log('LIKE COMMENT', 'comment', comment)
    //   expect(JSON.parse(postData.text)).toEqual('some')
    // });
    // it('DISLIKE POST_6 BY  accessToken_2', async () => {
    //   const postData = await testManager.likeEntity(
    //     ENTITIES.POSTS, accessToken_2,
    //     POST_6, LIKE_STATUSES.DISLIKE)
    //   console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
    //   // console.log('LIKE COMMENT', 'comment', comment)
    //   expect(JSON.parse(postData.text)).toEqual('some')
    // });
    it('Get post by id', async ()=>{
      const postResp = await testManager.getPosts(accessToken)
      expect(postResp).toEqual('post some')
    })

  });
});
