package org.robbie.brewtrail.config

import jakarta.servlet.*
import jakarta.servlet.http.HttpServletResponse
import jakarta.servlet.http.HttpServletResponseWrapper
import org.springframework.stereotype.Component
import java.io.IOException

@Component
class TransferEncodingFixFilter : Filter {
    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        val wrappedResponse = object : HttpServletResponseWrapper(response as HttpServletResponse) {
            override fun addHeader(name: String, value: String) {
                if (name == "Transfer-Encoding" && containsHeader(name)) {
                    return // Ignore attempts to add a duplicate Transfer-Encoding header
                }
                super.addHeader(name, value)
            }
        }
        chain.doFilter(request, wrappedResponse)
    }

    override fun init(filterConfig: FilterConfig) {
        // Not needed for this example
    }

    override fun destroy() {
        // Not needed for this example
    }
}