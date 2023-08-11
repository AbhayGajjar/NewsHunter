import React, { useEffect,useState } from 'react'
import Newsitem from './Newsitem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


const News=(props)=> {
   
    const [articles, setarticles] = useState([])
    const [loading, setloading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, settotalResults] = useState(0)
    const capitalization = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    const newsUpdate= async()=> {
        props.setProgress(20);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page}&pageSize=${props.pageSize}`;
        // this.setState({ loading: true })
        setloading(true)
        let data = await fetch(url)
        let parsedData = await data.json()
        props.setProgress(50)
        console.log(parsedData)
        setarticles(parsedData.articles)
        settotalResults(parsedData.totalResults)
        setloading(false)
        props.setProgress(100)

    }

 
    const fetchMoreData = async () => {
     
      
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1)
        let data = await fetch(url)
        let parsedData = await data.json()
        console.log(parsedData)
        setarticles(articles.concat(parsedData.articles))
        settotalResults(parsedData.totalResults)
        setloading(false)       
    }
    useEffect(() => {
        newsUpdate();
        
    }, [])
        return (
            <>
                <h2 className='text-center mt-5 mb-2 pt-4'>News Terminators - Top {capitalization(props.category)} Headlines</h2>
                {loading && <Spinner />}

                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner />}>
                    <div className="container">
                        <div className="row">
                            { articles.map((element) => {
                                return <div className="col-md-4" key={element.url}>
                                    <Newsitem title={element.title ? element.title : ''} description={element.description ? element.description : ''} imageUrl={element.urlToImage ? element.urlToImage : `https://pbs.twimg.com/media/EUqNoepU4AIwT_D?format=jpg&name=small`} newsUrl={element.url} author={element.author ? element.author : 'Unknown'} date={new Date(element.publishedAt).toGMTString()} source={element.source.name} />
                                </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
            </>
        )
    
}
News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}
News.defaultProps = {
    country: 'in',
    pageSize: 6,
    category: 'general'

}
export default News
