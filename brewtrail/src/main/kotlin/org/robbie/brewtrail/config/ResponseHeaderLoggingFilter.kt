package org.robbie.brewtrail.config

import org.slf4j.LoggerFactory
import jakarta.servlet.*
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import java.io.IOException

@Component
class ResponseHeaderLoggingFilter : Filter {

    private val logger = LoggerFactory.getLogger(ResponseHeaderLoggingFilter::class.java)

    @Throws(IOException::class, ServletException::class)
    override fun doFilter(
        request: ServletRequest,
        response: ServletResponse,
        chain: FilterChain
    ) {
        chain.doFilter(request, response)

        (response as HttpServletResponse).headerNames.forEach { headerName ->
            response.getHeaders(headerName).forEach { headerValue ->
                logger.debug("Header: $headerName - Value: $headerValue")
            }
        }
    }

    override fun init(filterConfig: FilterConfig) {
        // Initialization code, if needed.
    }

    override fun destroy() {
        // Cleanup code, if needed.
    }
}
