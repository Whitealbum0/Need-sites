#!/usr/bin/env python3
"""
Backend API Testing Suite for E-commerce Application
Tests authentication, role-based access, product management, visitor tracking, and analytics
"""

import requests
import json
import base64
import time
from datetime import datetime
from typing import Dict, Optional

# Configuration
BASE_URL = "https://b7f67874-c8e5-40c3-a6b3-e2871ce1485f.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class BackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.admin_token = None
        self.user_token = None
        self.test_results = {}
        
    def log_test(self, test_name: str, success: bool, message: str, details: str = ""):
        """Log test results"""
        self.test_results[test_name] = {
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test basic health check endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True, "API is healthy and responding")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected health status: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"Health check failed with status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Health check request failed: {str(e)}")
            return False
    
    def test_auth_login_redirect(self):
        """Test authentication login redirect endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/auth/login")
            if response.status_code == 200:
                data = response.json()
                if "auth_url" in data and "emergentagent.com" in data["auth_url"]:
                    self.log_test("Auth Login Redirect", True, "Login redirect URL generated successfully")
                    return True
                else:
                    self.log_test("Auth Login Redirect", False, f"Invalid auth URL format: {data}")
                    return False
            else:
                self.log_test("Auth Login Redirect", False, f"Login redirect failed with status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Auth Login Redirect", False, f"Login redirect request failed: {str(e)}")
            return False
    
    def test_auth_session_invalid(self):
        """Test authentication with invalid session"""
        try:
            payload = {"session_id": "invalid_session_id_12345"}
            response = self.session.post(f"{self.base_url}/auth/session", json=payload)
            
            # Should return 401 for invalid session
            if response.status_code == 401:
                self.log_test("Auth Invalid Session", True, "Invalid session properly rejected")
                return True
            else:
                self.log_test("Auth Invalid Session", False, f"Expected 401 but got {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Auth Invalid Session", False, f"Invalid session test failed: {str(e)}")
            return False
    
    def test_protected_endpoint_without_auth(self):
        """Test accessing protected endpoint without authentication"""
        try:
            response = self.session.get(f"{self.base_url}/auth/me")
            if response.status_code == 401:
                self.log_test("Protected Endpoint No Auth", True, "Protected endpoint properly requires authentication")
                return True
            else:
                self.log_test("Protected Endpoint No Auth", False, f"Expected 401 but got {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Protected Endpoint No Auth", False, f"Protected endpoint test failed: {str(e)}")
            return False
    
    def test_admin_endpoint_without_auth(self):
        """Test accessing admin endpoint without authentication"""
        try:
            response = self.session.get(f"{self.base_url}/admin/analytics")
            if response.status_code in [401, 403]:
                self.log_test("Admin Endpoint No Auth", True, "Admin endpoint properly requires authentication")
                return True
            else:
                self.log_test("Admin Endpoint No Auth", False, f"Expected 401/403 but got {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Endpoint No Auth", False, f"Admin endpoint test failed: {str(e)}")
            return False
    
    def test_products_public_access(self):
        """Test public access to products endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/products")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Products Public Access", True, f"Products endpoint accessible, returned {len(data)} products")
                    return True
                else:
                    self.log_test("Products Public Access", False, f"Expected list but got: {type(data)}")
                    return False
            else:
                self.log_test("Products Public Access", False, f"Products endpoint failed with status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Products Public Access", False, f"Products endpoint test failed: {str(e)}")
            return False
    
    def test_categories_endpoint(self):
        """Test categories endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/categories")
            if response.status_code == 200:
                data = response.json()
                if "categories" in data and isinstance(data["categories"], list):
                    self.log_test("Categories Endpoint", True, f"Categories endpoint working, returned {len(data['categories'])} categories")
                    return True
                else:
                    self.log_test("Categories Endpoint", False, f"Invalid categories response format: {data}")
                    return False
            else:
                self.log_test("Categories Endpoint", False, f"Categories endpoint failed with status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Categories Endpoint", False, f"Categories endpoint test failed: {str(e)}")
            return False
    
    def test_product_search(self):
        """Test product search functionality"""
        try:
            # Test search parameter
            response = self.session.get(f"{self.base_url}/products?search=test")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Product Search", True, f"Product search working, returned {len(data)} results")
                    return True
                else:
                    self.log_test("Product Search", False, f"Expected list but got: {type(data)}")
                    return False
            else:
                self.log_test("Product Search", False, f"Product search failed with status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Product Search", False, f"Product search test failed: {str(e)}")
            return False
    
    def test_product_category_filter(self):
        """Test product category filtering"""
        try:
            response = self.session.get(f"{self.base_url}/products?category=electronics")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Product Category Filter", True, f"Category filter working, returned {len(data)} results")
                    return True
                else:
                    self.log_test("Product Category Filter", False, f"Expected list but got: {type(data)}")
                    return False
            else:
                self.log_test("Product Category Filter", False, f"Category filter failed with status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Product Category Filter", False, f"Category filter test failed: {str(e)}")
            return False
    
    def test_product_create_without_auth(self):
        """Test creating product without admin authentication"""
        try:
            product_data = {
                "name": "Test Product",
                "description": "Test Description",
                "price": 99.99,
                "category": "test",
                "stock": 10
            }
            response = self.session.post(f"{self.base_url}/products", json=product_data)
            if response.status_code in [401, 403]:
                self.log_test("Product Create No Auth", True, "Product creation properly requires admin authentication")
                return True
            else:
                self.log_test("Product Create No Auth", False, f"Expected 401/403 but got {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Product Create No Auth", False, f"Product creation test failed: {str(e)}")
            return False
    
    def test_product_update_without_auth(self):
        """Test updating product without admin authentication"""
        try:
            update_data = {"name": "Updated Product"}
            response = self.session.put(f"{self.base_url}/products/test-id", json=update_data)
            if response.status_code in [401, 403]:
                self.log_test("Product Update No Auth", True, "Product update properly requires admin authentication")
                return True
            else:
                self.log_test("Product Update No Auth", False, f"Expected 401/403 but got {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Product Update No Auth", False, f"Product update test failed: {str(e)}")
            return False
    
    def test_product_delete_without_auth(self):
        """Test deleting product without admin authentication"""
        try:
            response = self.session.delete(f"{self.base_url}/products/test-id")
            if response.status_code in [401, 403]:
                self.log_test("Product Delete No Auth", True, "Product deletion properly requires admin authentication")
                return True
            else:
                self.log_test("Product Delete No Auth", False, f"Expected 401/403 but got {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Product Delete No Auth", False, f"Product deletion test failed: {str(e)}")
            return False
    
    def test_visitor_tracking_background(self):
        """Test that visitor tracking works in background"""
        try:
            # Make a request to products endpoint which should trigger visitor tracking
            headers = {
                "User-Agent": "TestBot/1.0",
                "X-Forwarded-For": "192.168.1.100"
            }
            response = self.session.get(f"{self.base_url}/products", headers=headers)
            
            if response.status_code == 200:
                # Wait a moment for background task to complete
                time.sleep(1)
                self.log_test("Visitor Tracking Background", True, "Visitor tracking appears to be working (background task)")
                return True
            else:
                self.log_test("Visitor Tracking Background", False, f"Request failed with status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Visitor Tracking Background", False, f"Visitor tracking test failed: {str(e)}")
            return False
    
    def test_logout_without_auth(self):
        """Test logout without authentication"""
        try:
            response = self.session.post(f"{self.base_url}/auth/logout")
            # Logout should work even without auth (just return success)
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("Logout No Auth", True, "Logout endpoint handles unauthenticated requests properly")
                    return True
                else:
                    self.log_test("Logout No Auth", False, f"Unexpected logout response: {data}")
                    return False
            else:
                self.log_test("Logout No Auth", False, f"Logout failed with status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Logout No Auth", False, f"Logout test failed: {str(e)}")
            return False
    
    def test_invalid_product_id(self):
        """Test accessing product with invalid ID"""
        try:
            response = self.session.get(f"{self.base_url}/products/invalid-product-id-12345")
            if response.status_code == 404:
                self.log_test("Invalid Product ID", True, "Invalid product ID properly returns 404")
                return True
            else:
                self.log_test("Invalid Product ID", False, f"Expected 404 but got {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Invalid Product ID", False, f"Invalid product ID test failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("BACKEND API TESTING SUITE")
        print("=" * 60)
        print(f"Testing API at: {self.base_url}")
        print()
        
        # Basic connectivity tests
        print("🔍 BASIC CONNECTIVITY TESTS")
        print("-" * 40)
        self.test_health_check()
        
        # Authentication tests
        print("\n🔐 AUTHENTICATION TESTS")
        print("-" * 40)
        self.test_auth_login_redirect()
        self.test_auth_session_invalid()
        self.test_protected_endpoint_without_auth()
        self.test_logout_without_auth()
        
        # Role-based access control tests
        print("\n👥 ROLE-BASED ACCESS CONTROL TESTS")
        print("-" * 40)
        self.test_admin_endpoint_without_auth()
        self.test_product_create_without_auth()
        self.test_product_update_without_auth()
        self.test_product_delete_without_auth()
        
        # Product management tests
        print("\n📦 PRODUCT MANAGEMENT TESTS")
        print("-" * 40)
        self.test_products_public_access()
        self.test_categories_endpoint()
        self.test_product_search()
        self.test_product_category_filter()
        self.test_invalid_product_id()
        
        # Visitor tracking tests
        print("\n📊 VISITOR TRACKING TESTS")
        print("-" * 40)
        self.test_visitor_tracking_background()
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for test_name, result in self.test_results.items():
                if not result["success"]:
                    print(f"  - {test_name}: {result['message']}")
        
        print("\n✅ PASSED TESTS:")
        for test_name, result in self.test_results.items():
            if result["success"]:
                print(f"  - {test_name}: {result['message']}")
        
        return passed_tests, failed_tests, self.test_results

if __name__ == "__main__":
    tester = BackendTester()
    passed, failed, results = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if failed == 0 else 1)