const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
    it('should return a list of apps', () => {
        return request(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.a.lengthOf.at.least(1);
                const result = res.body[0];
                expect(result).to.include.all.keys("App","Category","Rating","Reviews","Size","Installs","Type","Price","Content Rating","Genres","Last Updated","Current Ver","Android Ver");
            });
    });
    it('should be 400 if genres is incorrect', () => {
        return request(app)
        .get('/apps')
        .query({genre: 'MISTAKE'})
        .expect(400, 'Genres must be one of these: Action, Puzzle, Strategy, Casual, Arcade, or Card')   
    });
    it('should be 400 if sort is incorrect', () => {
        return request(app)
        .get('/apps')
        .query({sort: 'MISTAKE'})
        .expect(400, 'Sort must be by rating or app')   
    });
    it.skip('should sort by app', () => {
        return request(app)
            .get('/apps')
            .query({sort: 'app'})
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                let i = 0;
                let sorted = true;
                while(sorted && i < res.body.length-1){
                    sorted = sorted && res.body[i].App < res.body[i + 1].App;
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })
    it.skip('should sort by rank', () => {
        return request(app)
            .get('/apps')
            .query({sort: 'rank'})
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                let i = 0;
                let sorted = true;
                while(sorted && i < res.body.length-1){
                    sorted = sorted && res.body[i].Rank < res.body[i + 1].Rank;
                    i++;
                }
                expect(sorted).to.be.true;
            })
    });
    it.skip('filter by Genres', () => {
        return request(app)
            .get('/apps')
            .query({genre: 'Card'})
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                let i = 0;
                let filtered = true;
                while(filtered && i < res.body.length){
                    filtered = filtered && res.body[i].Genres.filter.includes('Card') > 0;
                };
            });
        });
});

