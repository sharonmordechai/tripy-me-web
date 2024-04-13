package com.tripyme.rest.repository;

import com.tripyme.rest.model.Country;
import com.tripyme.rest.model.CountryName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long>{
    Optional<Country> findByName(CountryName roleName);
}
