import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'

import './index.css'

const productsDetailsConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN PROGRESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productsDetailsList: [],
    activeProductStatus: productsDetailsConstant.initial,
    count: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({activeProductStatus: productsDetailsConstant.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, option)
    if (response.ok) {
      const data = await response.json()
      const formattedProductDetails = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        similarProducts: data.similar_products,
        style: data.style,
        title: data.title,
        totalReview: data.total_reviews,
      }
      const formattedSimilarProducts = data.similar_products.map(eachItem => ({
        availability: eachItem.availability,
        imageUrl: eachItem.image_url,
        brand: eachItem.brand,
        description: eachItem.description,
        id: eachItem.id,
        price: eachItem.price,
        rating: eachItem.rating,
        style: eachItem.style,
        title: eachItem.title,
        totalReview: eachItem.total_reviews,
      }))

      const updatedProductDetails = {
        ...formattedProductDetails,
        similarProducts: formattedSimilarProducts,
      }
      this.setState({
        productsDetailsList: updatedProductDetails,
        activeProductStatus: productsDetailsConstant.success,
      })
    } else {
      this.setState({activeProductStatus: productsDetailsConstant.failure})
    }
  }

  onDecrementCount = () => {
    const {count} = this.state

    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  onIncrementCount = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  renderProduct = () => {
    const {productsDetailsList, count} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReview,
      description,
      availability,
      brand,
      similarProducts,
    } = productsDetailsList

    console.log(similarProducts)

    return (
      <>
        <Header />
        <div className="product-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product-details-container">
            <h1 className="title">{title}</h1>
            <p className="price">{`Rs ${price}/-`}</p>
            <div className="rating-and-review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p>{`${totalReview} Reviews`}</p>
            </div>
            <p className="description">{description}</p>
            <p>{`Available: ${availability}`}</p>
            <p>{`Brand: ${brand}`}</p>
            <hr />
            <div className="product-count-container">
              <button
                data-testid="minus"
                type="button"
                label="Decrement count"
                onClick={this.onDecrementCount}
                className="btn"
              >
                <BsDashSquare />
              </button>
              <p>{count}</p>
              <button
                data-testid="plus"
                type="button"
                label="Increment count"
                onClick={this.onIncrementCount}
                className="btn"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-product-heading">Similar Products</h1>
        <ul className="product-ul-container">
          {similarProducts.map(eachProduct => (
            <li className="product-list-item" key={eachProduct.id}>
              <img
                src={eachProduct.imageUrl}
                alt="similar product"
                className="similar-product-image"
              />
              <h1 className="product-title">{eachProduct.title}</h1>
              <p>{`by ${eachProduct.brand}`}</p>
              <div className="price-and-rating-container">
                <p>{`Rs ${price}/-`}</p>
                <div className="rating-container">
                  <p className="rating">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  continueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoader = () => (
    <>
      <Header />
      <div className="products-loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    </>
  )

  renderProductNotFound = () => (
    <>
      <Header />
      <div className="product-not-found-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="error-image"
        />
        <h1>Product Not Found</h1>
        <button
          type="button"
          className="continue-shopping-btn"
          onClick={this.continueShopping}
        >
          Continue Shopping
        </button>
      </div>
    </>
  )

  render() {
    const {activeProductStatus} = this.state

    switch (activeProductStatus) {
      case productsDetailsConstant.success:
        return this.renderProduct()
      case productsDetailsConstant.inProgress:
        return this.renderLoader()
      case productsDetailsConstant.failure:
        return this.renderProductNotFound()
      default:
        return null
    }
  }
}

export default ProductItemDetails
