const faker = require('faker');
const Post = require('./models/post');

const mockImages = [
    'https://i.picsum.photos/id/538/640/640.jpg',
    'https://i.picsum.photos/id/58/600/600.jpg',
    'https://i.picsum.photos/id/873/600/600.jpg',
    'https://i.picsum.photos/id/547/600/600.jpg',
    'https://i.picsum.photos/id/691/600/600.jpg',
    'https://i.picsum.photos/id/680/600/600.jpg',
    'https://i.picsum.photos/id/703/600/600.jpg',
    'https://i.picsum.photos/id/937/600/600.jpg',
    'https://i.picsum.photos/id/650/600/600.jpg',
    'https://i.picsum.photos/id/668/600/600.jpg',
    'https://i.picsum.photos/id/619/600/600.jpg',
    'https://i.picsum.photos/id/548/600/600.jpg',
    'https://i.picsum.photos/id/401/600/600.jpg',
    'https://i.picsum.photos/id/338/600/600.jpg',
    'https://i.picsum.photos/id/558/600/600.jpg',
    'https://i.picsum.photos/id/2/600/600.jpg',
    'https://i.picsum.photos/id/310/600/600.jpg',
    'https://i.picsum.photos/id/152/600/600.jpg',
    'https://i.picsum.photos/id/386/600/600.jpg',
    'https://i.picsum.photos/id/835/600/600.jpg',
    'https://i.picsum.photos/id/521/600/600.jpg',
    'https://i.picsum.photos/id/586/600/600.jpg',
    'https://i.picsum.photos/id/239/600/600.jpg',
    'https://i.picsum.photos/id/617/600/600.jpg',
    'https://i.picsum.photos/id/1019/600/600.jpg',
    'https://i.picsum.photos/id/435/600/600.jpg',
    'https://i.picsum.photos/id/239/600/600.jpg',
    'https://i.picsum.photos/id/993/600/600.jpg',
    'https://i.picsum.photos/id/985/600/600.jpg',
    'https://i.picsum.photos/id/1018/600/600.jpg',
    'https://i.picsum.photos/id/805/600/600.jpg',
    'https://i.picsum.photos/id/1008/600/600.jpg',
    'https://i.picsum.photos/id/628/600/600.jpg',
    'https://i.picsum.photos/id/141/600/600.jpg',
    'https://i.picsum.photos/id/1040/600/600.jpg',
    'https://i.picsum.photos/id/294/600/600.jpg',
    'https://i.picsum.photos/id/504/600/600.jpg',
    'https://i.picsum.photos/id/389/600/600.jpg',
    'https://i.picsum.photos/id/616/600/600.jpg',
    'https://i.picsum.photos/id/1053/600/600.jpg'
];

const getMockImage = faker.random.arrayElement(mockImages);

async function seedPosts() {
    await Post.deleteMany({});
    // create 40 new posts
    for(const i of new Array(40)) {
        const post = {
            title: faker.lorem.word(),
            price: faker.random.number(),
            description: faker.lorem.text(),
            coordinates: [-122.0842499, 37.4224764],    // mountain view coordinates
            images: [{
                url: getMockImage
            }],
            author: {
                '_id' : '5e691d837c30c848fc8b886d',
                'username' : 'zuzu'
            }
        }
        await Post.create(post);
        // console.log(post);
    }
    console.log('40 new posts created');
    
}

module.exports = seedPosts;
