import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./Trending.css";

const style = {
    height: 30,
    margin: 6,
    padding: 8
};

export default class Trending extends React.Component {
    state = {
        items: [],
        hasMore: false,
        pageNumber: 1,
        pageSize: 20,
        total: 0
    };

    fetchMoreData = () => {
        const url = `http://localhost:3001/trending?page_number=${this.state.pageNumber}&page_size=${this.state.pageSize}`;
        fetch(url)
        .then(response => response.json())
        .then(response => {
            this.setState({
                items: this.state.items.concat(response.results),
                total: response.total,
                pageNumber: this.state.pageNumber + 1
            });

            let hasMore = this.state.items.length < this.state.total;
            this.setState({ hasMore });
        });
    };

    componentDidMount() {
        this.fetchMoreData();
    };

    render() {
        return (
            <div className="trending">
                <h1>Trending Orders</h1>
                <hr />
                <InfiniteScroll
                    dataLength={this.state.items.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.hasMore}
                    loader={<h4>Loading...</h4>}
                    height={400}
                    endMessage={
                        <p style={{ textAlign: "center" }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    {this.state.items.map((i: any, index: number) => (
                        <div style={style} key={index}>
                            <strong>{i.inventory_name}</strong> ordered {i.number_orders} times from {i.restaurant_name} {i.time_ago}
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        );
    }
}